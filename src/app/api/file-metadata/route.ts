// app/api/file-metadata/route.ts

import { NextResponse } from 'next/server';
import { TableClient } from '@azure/data-tables';

export async function POST(request: Request) {
  try {
    const { fileNames } = await request.json();

    console.log("--- API Debug Start ---");
    console.log("1. Received fileNames:", fileNames);

    if (!fileNames || !Array.isArray(fileNames)) {
      return NextResponse.json({ error: "ファイル名が必要です" }, { status: 400 });
    }

    const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
    // 接続文字列のチェック
    if (!connectionString) {
      console.error("Error: AZURE_STORAGE_CONNECTION_STRING が設定されていません。");
      return NextResponse.json({ error: "Server config error" }, { status: 500 });
    }

    const tableName = "LatestDocumentDB";
    const tableClient = TableClient.fromConnectionString(connectionString, tableName);

    const metadataMap: Record<string, { category: string, date: string }> = {};

    for (const fileName of fileNames) {
      console.log(`2. Searching for: [${fileName}]`);
      
      // 念のためURIデコードなどを考慮して検索
      try {
        const entities = tableClient.listEntities({
          queryOptions: { filter: `CurrentFileName eq '${fileName}'` }
        });

        let found = false;
        for await (const entity of entities) {
          console.log(`3. Found match! PartitionKey: ${entity.partitionKey}`);
          metadataMap[fileName] = {
            category: (entity.partitionKey as string) || "未分類",
            date: String(entity.LatestDate || "-"),
          };
          found = true;
          break; 
        }

        if (!found) {
          console.log(`3. Not found in Table for: [${fileName}]`);
        }

      } catch (queryError) {
        console.error(`Query Error for ${fileName}:`, queryError);
      }
    }

    console.log("4. Returning map:", metadataMap);
    console.log("--- API Debug End ---");

    return NextResponse.json(metadataMap);

  } catch (error) {
    console.error("Metadata fetch error:", error);
    return NextResponse.json({ error: "メタデータ取得失敗" }, { status: 500 });
  }
}
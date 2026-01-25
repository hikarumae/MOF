// app/api/upload/route.ts

import { NextResponse } from 'next/server';
import { BlobServiceClient } from '@azure/storage-blob';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: "ファイルがありません" }, { status: 400 });
    }

    // 環境変数から接続文字列を取得
    const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING!;
    const containerName = "mof2-blob-new"; // 指定のコンテナ名
    
    const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
    const containerClient = blobServiceClient.getContainerClient(containerName);
    
    // コンテナが存在しない場合は作成（オプション）
    // await containerClient.createIfNotExists();

    const blockBlobClient = containerClient.getBlockBlobClient(file.name);
    const arrayBuffer = await file.arrayBuffer();

    await blockBlobClient.uploadData(Buffer.from(arrayBuffer), {
      blobHTTPHeaders: { blobContentType: file.type }
    });

    return NextResponse.json({ message: "アップロード成功", url: blockBlobClient.url });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "アップロード失敗" }, { status: 500 });
  }
}
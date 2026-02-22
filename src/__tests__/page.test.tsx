// __tests__/page.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Home from '../app/page';


// ▼▼ 「ファイルのアップロードが正しく動くか」だけのテストのためnext-auth を偽物にすり替える ▼▼
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(() => ({ data: null, status: 'unauthenticated' })),
  signIn: jest.fn(),
  signOut: jest.fn(),
}));

// 1. fetchAPIをモック化（実際にAzureに通信させないため）
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ message: 'アップロード成功' }),
  })
) as jest.Mock;

// 2. カスタムフック useFileSearch をモック化（アップロード画面を初期表示させるため）
jest.mock('../hooks/useFileSearch', () => ({
  useFileSearch: () => ({
    searchQuery: '',
    setSearchQuery: jest.fn(),
    isSearched: false, // falseにすることで「検索前の画面」を表示
    setIsSearched: jest.fn(),
    searchResults: [],
    handleSearch: jest.fn(),
  }),
}));

describe('ファイルアップロードの単体テスト', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // 各テスト前にモックの呼び出し履歴をリセット
  });

  it('[正常系] 10MB以下のファイルをセットした場合、アップロード処理が走ること', async () => {
    render(<Home />);
    
    // 5MBのダミーファイルを作成
    const normalFile = new File(['dummy content'], 'normal.pdf', { type: 'application/pdf' });
    Object.defineProperty(normalFile, 'size', { value: 5 * 1024 * 1024 }); // 5MB

    // 画面内にある、ファイルのアップロード用の input(type="file") 要素を見つけ出す
// ※非表示（hidden）になっているため、hidden: true を指定して探します
// ※eslintの警告が出るかもしれませんが、テストコードなので一旦無視して大丈夫です
// eslint-disable-next-line testing-library/no-node-access
const input = document.querySelector('input[type="file"]') as HTMLInputElement;

    // ファイルを選択するイベントを発火
    fireEvent.change(input, { target: { files: [normalFile] } });

    // fetch（アップロード処理）が呼ばれたことを確認
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });
    
    // エラーメッセージが表示されていないことを確認
    expect(screen.queryByTestId('file-error-message')).not.toBeInTheDocument();
  });

  it('[異常系] 10MBを超えるファイルをセットした場合、エラーが表示されアップロードされないこと', async () => {
    render(<Home />);
    
    // 15MBのダミーファイルを作成
    const hugeFile = new File(['dummy content'], 'huge.pdf', { type: 'application/pdf' });
    Object.defineProperty(hugeFile, 'size', { value: 15 * 1024 * 1024 }); // 15MB

    // 画面内にある、ファイルのアップロード用の input(type="file") 要素を見つけ出す
// ※非表示（hidden）になっているため、hidden: true を指定して探します
// ※eslintの警告が出るかもしれませんが、テストコードなので一旦無視して大丈夫です
// eslint-disable-next-line testing-library/no-node-access
const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    

    // ファイルを選択するイベントを発火
    fireEvent.change(input, { target: { files: [hugeFile] } });

    // エラーメッセージが表示されることを確認
    await waitFor(() => {
      expect(screen.getByTestId('file-error-message')).toHaveTextContent(
        'ファイルサイズが大きすぎます'
      );
    });

    // fetch（アップロード処理）が1回も呼ばれていないことを確認
    expect(global.fetch).not.toHaveBeenCalled();
  });
});

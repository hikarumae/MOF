import nextJest from 'next/jest.js'
 
const createJestConfig = nextJest({
  // Next.jsアプリのルートディレクトリを指定
  dir: './',
})
 
// Jestのカスタム設定
/** @type {import('jest').Config} */
const config = {
  // ブラウザ環境（DOM）をシミュレートする
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    // '@/' で始まるパスを '<rootDir>/src/' に読み替えるようJestに指示します
    '^@/(.*)$': '<rootDir>/src/$1',
    // node_modules の中でトランスパイルから除外しないパッケージを指定します
  transformIgnorePatterns: [
    '/node_modules/(?!(next-auth|@auth)/)',
  ],
  },
}
 
export default createJestConfig(config)

# 🛒 쇼핑 리스트 앱

localStorage 기반의 단일 파일 한국어 쇼핑 리스트 웹앱입니다.

## 기능

- 아이템 추가 (버튼 클릭 또는 Enter 키)
- 아이템 체크/체크 해제
- 아이템 삭제
- 완료 항목 일괄 삭제
- 완료 항목 수 요약 표시
- localStorage를 통한 데이터 영속성
- XSS 방어 처리

## 사용법

`index.html` 파일을 브라우저에서 직접 열면 됩니다.

## 테스트

```bash
npm install
npx playwright install
npm test
```

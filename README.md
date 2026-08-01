# 🛒 쇼핑 리스트 앱

Supabase를 백엔드로 쓰는 단일 파일 한국어 쇼핑 리스트 웹앱입니다.

배포: https://shopping-listapp.pages.dev

## 기능

- 아이템 추가 (버튼 클릭 또는 Enter 키)
- 아이템 체크/체크 해제
- 아이템 삭제
- 완료 항목 일괄 삭제
- 완료 항목 수 요약 표시
- Supabase(Postgres)를 통한 데이터 영속성 — 어느 기기에서 열어도 같은 목록
- 연결 상태/오류를 화면 상단 상태 바에 표시
- 텍스트를 `textContent`로만 렌더링 (XSS 방어)

## 구성

진입점은 `index.html` 하나입니다. 빌드 단계가 없고, Supabase JS 클라이언트를 CDN에서 불러옵니다.

- Supabase 프로젝트: `hhufwsavpvpqmhjufxqu` (kang-aco / shopping-list)
- 테이블: `shopping_list` — `id`, `text`, `checked`, `created_at`

`index.html`에 들어 있는 키는 Supabase의 anon(공개) 키입니다. 공개되도록 설계된 값이며, 실제 접근 통제는 테이블의 RLS 정책이 담당합니다.

## 사용법

`index.html`을 브라우저에서 직접 열거나, 배포 URL로 접속하면 됩니다.

## 테스트

```bash
npm install
npx playwright install
npm test
```

> 참고: `shopping.test.js`는 localStorage 시절 마크업(`.btn-add`, `.btn-delete`, `#empty`)을 대상으로 작성돼 있어 현재 Supabase 버전에서는 통과하지 않습니다.

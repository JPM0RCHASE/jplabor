# JP LABOR 블로그 자산 자동 생성기

홈페이지 톤(스포티파이 다크 + 네온 그린)을 그대로 살린 네이버 블로그용
**썸네일 · 소제목 구분선 · CTA 배너 · 원고**를 JSON 하나로 일괄 생성합니다.

---

## 🗂 폴더 구조

```
blog-assets/
├── generate.mjs        ← 자동 생성 스크립트 (핵심)
├── thumbnail.html      ← 썸네일 단독 미리보기/수동 캡처용
├── divider.html        ← 구분선 미리보기용
├── cta.html            ← CTA 미리보기용
├── posts/
│   └── 노조가입.json    ← 글 1편 = JSON 1개
└── blog-output/
    └── 노조가입/         ← 생성 결과물 (이미지 + 원고)
        ├── thumbnail.png
        ├── divider-1~N.png
        ├── cta.png
        ├── disclaimer.png   ← 면책조항 배너 (밝은 톤, 글 맨 아래용)
        └── 원고.txt
```

---

## ⚡ 사용법 (글 한 편 발행 흐름)

### 1. JSON 작성 — `posts/새글.json`
```json
{
  "slug": "통상임금",
  "label": "JP LABOR · 노동법 실무",
  "title": "통상임금|완벽 정리|, 이것만 알면 끝",
  "titleAccent": "완벽 정리",
  "subtitle": "정기·일률·고정성 3요건 해설",
  "sections": ["통상임금이란?", "판단 3요건", "실무 계산법"],
  "body": "여기에 네이버 붙여넣기용 원고 전체를 작성"
}
```
- `title`: `|` 로 구분 (줄바꿈은 `\n`)
- `titleAccent`: 초록으로 강조할 단어 (title 안에 똑같이 있어야 함)
- `sections`: 배열 개수만큼 구분선 이미지가 자동 생성됨

### 2. 실행
```bash
node generate.mjs posts/통상임금.json
```

### 3. 결과
`blog-output/통상임금/` 폴더에 이미지 전부 + 원고.txt 생성 완료.

### 4. 네이버 발행 (수동 5분)
- 네이버 블로그 글쓰기 → 이미지 드래그&드롭
- 원고.txt 복붙
- 끝.

---

## 💻 본인 PC에 설치하는 법 (최초 1회)

### 준비물
- Node.js 18+ : https://nodejs.org 에서 LTS 설치

### 설치 단계
```bash
# 1) 이 blog-assets 폴더를 PC로 복사 (또는 git clone)
cd blog-assets

# 2) playwright 설치
npm init -y
npm install playwright

# 3) 크롬 다운로드 (자동)
npx playwright install chromium
```

### 실행
```bash
node generate.mjs posts/노조가입.json
```
> 본인 PC에서는 `PW_CHROME` 환경변수 불필요 — playwright가 받은 크롬을 자동 사용합니다.
> (이 클라우드 환경에서만 `PW_CHROME=...` 로 크롬 경로를 지정했던 것)

---

## 🔁 여러 글 한꺼번에 생성 (선택)

```bash
for f in posts/*.json; do node generate.mjs "$f"; done
```
posts 폴더에 JSON 10개 넣고 위 한 줄 → 10편 분량 자산이 통째로 쏟아집니다.

---

## 🎨 디자인 수정하고 싶을 때

`generate.mjs` 안의 `thumbHTML / dividerHTML / ctaHTML` 함수의
CSS 값(색상·폰트크기·여백)만 바꾸면 전체에 일괄 반영됩니다.
- 메인 그린: `#1ed760`
- 배경 검정: `#121212`
- 폰트: Pretendard (한글 최적화)

---

## ❗ 자동화 범위 (솔직하게)

| 단계 | 자동화 |
|------|--------|
| 원고·이미지 생성 | ✅ 완전 자동 |
| 파일 저장/정리 | ✅ 완전 자동 |
| 네이버 업로드 발행 | ⚠️ 수동 (드래그+복붙 5분) |

네이버는 봇 발행을 차단하므로 발행만 손으로 — 대신 이미지 만드는
노가다는 100% 사라집니다. (글당 1시간 → 5분)

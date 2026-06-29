# 법제처 MCP (korean-law-mcp) 설치 안내

법령·판례·조례를 Claude가 직접 조회·검증할 수 있게 해주는 MCP입니다.
블로그 본문의 법령/요율/판례 정확성 검증에 활용하세요.

## 1단계 — OC 키 발급 (무료, 1회만)
1. https://open.law.go.kr/LSO/openApi/guideList.do 접속
2. 회원가입 → OPEN API 활용 신청
3. 발급된 **OC 값**(예: `honggildong`, 보통 이메일 앞부분) 복사

## 2단계 — OC 키 입력
`~/jplabor/.mcp.json` 파일을 열어서
`"여기에_발급받은_OC값_입력"` 부분을 발급받은 OC 값으로 교체.

> ⚠️ OC 키는 개인 키이므로, 공개 저장소라면 커밋하지 말 것.
> (이미 커밋했다면 .mcp.json을 .gitignore에 넣거나 키를 로컬에서만 관리)

## 3단계 — Claude Code 재시작
`jplabor` 폴더에서 Claude Code를 켜면 .mcp.json이 자동 로드됩니다.
처음엔 "이 프로젝트의 MCP 서버를 신뢰하겠냐"고 물어보면 승인하세요.

설치 확인: Claude Code에서 `/mcp` 입력 → korean-law 가 목록에 보이면 성공.

---

## 환경별 사용 가능 여부

| 환경 | 방식 | 사용 |
|---|---|---|
| Claude Code (PC 터미널) | 로컬 npx (이 .mcp.json) | ✅ |
| Claude Desktop 앱 (PC) | claude_desktop_config.json에 동일 설정 | ✅ |
| claude.ai 웹 / 데스크탑 커넥터 | **원격 엔드포인트** 사용 | ✅ (아래 참고) |
| 모바일 앱 | 원격 커넥터 | △ (지원 범위에 따라) |

### claude.ai 웹챗에서 쓰려면 (원격 방식)
설정 → 커넥터(Connectors) → 커스텀 커넥터 추가 →
URL: `https://korean-law-mcp.fly.dev/mcp?oc=발급받은OC값`

이 방식은 PC 설치 없이 웹/앱에서 바로 됩니다. (제공자가 호스팅하는 서버 사용)

---

## Claude Desktop 앱 설정 위치
- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- 위 파일에 .mcp.json과 동일한 `mcpServers` 블록을 넣고 앱 재시작.

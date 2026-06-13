import os

TEMPLATE = '''<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<style>
  @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');
  *{{margin:0;padding:0;box-sizing:border-box;}}
  html,body{{background:#888;font-family:'Pretendard',sans-serif;}}
  #thumb{{
    width:1200px;height:630px;position:relative;overflow:hidden;
    background:radial-gradient(circle at 18% 22%,rgba(30,215,96,.10),transparent 42%),
    radial-gradient(circle at 88% 90%,rgba(30,215,96,.06),transparent 40%),#121212;
    display:flex;flex-direction:column;justify-content:center;padding:0 90px;
  }}
  #thumb::before{{content:"";position:absolute;left:0;top:0;bottom:0;width:6px;
    background:linear-gradient(180deg,#1ed760,rgba(30,215,96,.15));}}
  .t-label{{font-size:22px;font-weight:700;letter-spacing:3px;color:#1ed760;
    text-transform:uppercase;margin-bottom:30px;}}
  .t-label .dot{{display:inline-block;width:9px;height:9px;border-radius:50%;
    background:#1ed760;margin-right:12px;vertical-align:middle;
    box-shadow:0 0 12px rgba(30,215,96,.8);}}
  .t-title{{font-size:{title_size}px;font-weight:800;line-height:1.2;letter-spacing:-2px;
    color:#fff;text-shadow:0 4px 30px rgba(0,0,0,.5);}}
  .t-title .acc{{color:#1ed760;text-shadow:0 0 30px rgba(30,215,96,.45);}}
  .t-badge{{position:absolute;right:90px;top:50%;transform:translateY(-50%);width:130px;height:130px;border-radius:50%;
    background:rgba(30,215,96,.12);border:2px solid #1ed760;display:flex;flex-direction:column;
    align-items:center;justify-content:center;}}
  .t-badge .n{{font-size:48px;font-weight:800;color:#1ed760;line-height:1;}}
  .t-badge .u{{font-size:14px;font-weight:700;color:#1ed760;margin-top:4px;}}
  .t-sub{{font-size:22px;font-weight:500;color:#9a9a9a;margin-top:28px;}}
  .t-line{{position:absolute;left:90px;bottom:78px;width:120px;height:4px;
    background:#1ed760;border-radius:2px;box-shadow:0 0 14px rgba(30,215,96,.6);}}
  .t-wm{{position:absolute;right:46px;bottom:38px;font-size:20px;font-weight:700;color:#6f6f6f;}}
  .t-wm b{{color:#1ed760;}}
  #disc{{
    width:800px;margin:40px auto 0;
    background:#f7faf8;border:1px solid #e3ece6;border-left:5px solid #1ed760;
    border-radius:14px;padding:32px 36px;display:flex;gap:20px;align-items:flex-start;
  }}
  #disc .icon{{flex-shrink:0;width:44px;height:44px;border-radius:50%;
    background:rgba(30,215,96,.12);display:flex;align-items:center;
    justify-content:center;font-size:22px;margin-top:2px;}}
  .disc-head{{font-size:18px;font-weight:800;color:#16562f;margin-bottom:10px;
    display:flex;align-items:center;gap:8px;}}
  .disc-head .tag{{font-size:11px;font-weight:700;color:#1aa34a;
    background:#e7f8ee;padding:3px 9px;border-radius:9999px;}}
  .disc-text{{font-size:15.5px;color:#4a5a52;line-height:1.85;}}
  .disc-text b{{color:#16562f;font-weight:700;}}
  .disc-sign{{margin-top:12px;font-size:13px;font-weight:700;color:#9aa8a0;}}
  .disc-sign b{{color:#1ed760;}}
</style>
</head>
<body>
<div id="thumb">
  <div class="t-label"><span class="dot"></span>JP LABOR · 사례 백과</div>
  <div class="t-title">{title_html}</div>
  <div class="t-badge"><span class="n">{count}</span><span class="u">사례</span></div>
  <div class="t-sub">{sub}</div>
  <div class="t-line"></div>
  <div class="t-wm">공인노무사 <b>JP</b></div>
</div>
<div id="disc">
  <div class="icon">⚖️</div>
  <div>
    <div class="disc-head">법적 고지 <span class="tag">면책조항</span></div>
    <div class="disc-text">
      본 블로그에 게재된 내용은 <b>일반적인 정보 제공을 목적</b>으로 하며, 법률 자문이 아닙니다.
      개별 사안에 따라 결론이 달라질 수 있으므로 구체적인 사항은 반드시 <b>전문가와 상담</b>하시기 바랍니다.
      본 내용은 게시 시점의 법령·판례를 기준으로 작성되었으며, 이후 법령 변경에 따라 달라질 수 있습니다.
    </div>
    <div class="disc-sign">공인노무사 <b>JP</b> | jplabor.com</div>
  </div>
</div>
</body>
</html>'''

bundles = [
    ('근로계약서', '근로계약서·수습·위약금\n<span class="acc">실무 Q&A</span> 28선', '근로계약·수습기간·시용·위약금 완벽 정리 (2026)', 28, 56),
    ('해고징계', '해고·징계·인사발령\n<span class="acc">실무 Q&A</span> 36선', '징계절차·해고통지·부당해고·정리해고·전보 완벽 정리 (2026)', 36, 54),
    ('임금총정리', '임금 지급·통상임금·체불\n<span class="acc">실무 Q&A</span> 37선', '임금지급원칙·통상임금·포괄임금·임금체불·휴업수당 완벽 정리 (2026)', 37, 54),
    ('근로시간', '근로시간·연장·교대제\n<span class="acc">실무 Q&A</span> 19선', '법정근로시간·연장근로·휴게·교대제·출장 완벽 정리 (2026)', 19, 56),
    ('연차주휴', '연차휴가·주휴수당\n<span class="acc">실무 Q&A</span> 14선', '연차발생·사용촉진·주휴수당 완벽 정리 (2026)', 14, 60),
    ('기간제파견', '기간제·파견·영업양도\n<span class="acc">실무 Q&A</span> 23선', '기간제·무기계약·파견·불법파견·영업양도 완벽 정리 (2026)', 23, 56),
    ('노동조합교섭', '노동조합 교섭·쟁의·노란봉투법\n<span class="acc">실무 Q&A</span> 35선', '교섭창구단일화·단체협약·쟁의행위·노란봉투법 완벽 정리 (2026)', 35, 50),
    ('부당노동행위', '부당노동행위·노조활동\n<span class="acc">실무 Q&A</span> 12선', '부당노동행위·노조활동 정당성·근로시간면제 완벽 정리 (2026)', 12, 56),
    ('모성보호', '임신·출산·배우자·난임\n<span class="acc">실무 Q&A</span> 18선', '임신기보호·출산전후휴가·배우자출산휴가·난임치료휴가 완벽 정리 (2026)', 18, 54),
    ('육아휴직', '육아휴직·근로시간단축\n<span class="acc">실무 Q&A</span> 17선', '육아휴직·육아기근로시간단축·6+6특례·가족돌봄휴직 완벽 정리 (2026)', 17, 54),
    ('괴롭힘성희롱', '직장 내 괴롭힘·성희롱\n<span class="acc">실무 Q&A</span> 27선', '성희롱성립·괴롭힘·조사의무·피해자보호 완벽 정리 (2026)', 27, 54),
    ('5인미만', '5인 미만 사업장\n<span class="acc">실무 Q&A</span> 11선', '5인미만 근기법 적용·상시근로자 수 판단·사업장쪼개기 완벽 정리 (2026)', 11, 56),
    ('중대재해', '중대재해처벌법\n<span class="acc">실무 Q&A</span> 13선', '처벌주체·경영책임자·안전보건의무·위험성평가 완벽 정리 (2026)', 13, 58),
    ('취업규칙고령자', '취업규칙·임금피크제\n<span class="acc">실무 Q&A</span> 15선', '취업규칙 작성·변경절차·임금피크제·고령자 고용 완벽 정리 (2026)', 15, 56),
    ('연소근로자', '연소근로자 채용·보호\n<span class="acc">실무 Q&A</span> 3선', '미성년자 채용·근로시간·친권자 동의 실무 정리 (2026)', 3, 58),
]

out_dir = '/home/user/jplabor/blog-assets'
for slug, title_html, sub, count, title_size in bundles:
    fname = f'blog-사례백과_{slug}.html'
    html = TEMPLATE.format(
        title_html=title_html,
        sub=sub,
        count=count,
        title_size=title_size,
    )
    with open(os.path.join(out_dir, fname), 'w', encoding='utf-8') as f:
        f.write(html)
    print(f'✅ {fname}')

print('\n완료!')

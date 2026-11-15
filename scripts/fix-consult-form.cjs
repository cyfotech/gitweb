const fs = require('fs');
const p = 'frontend/src/pages/MainServicesPage.jsx';
let src = fs.readFileSync(p, 'utf8');

const dropdownRe = /<label style=\{cssToStyle\("display: grid; gap: 6px; font-size: 13px; font-weight: 600"\)\}>I am a[\s\S]*?<\/label>/;

const replacement = `                      <div style={cssToStyle("display: grid; gap: 6px; font-size: 13px; font-weight: 600; position: relative")}>I am a

                        <button type="button" onClick={v.toggleBiz} aria-haspopup="listbox" aria-expanded={v.bizOpen} style={cssToStyle("min-height: 48px; padding: 0 14px; border-radius: 12px; border: 1.5px solid " + (v.ferr.biz ? '#E11D48' : '#B8C4C1') + "; background: #FFFFFF; display: flex; align-items: center; justify-content: space-between; cursor: pointer; text-align: left; color: #0B1A1E")}>
                          <span style={cssToStyle("color: " + (v.fbiz ? '#0B1A1E' : '#8A9793'))}>{v.fbiz || 'Select your business type'}</span>
                          <span aria-hidden="true" style={cssToStyle("transition: transform .25s; transform: rotate(" + (v.bizOpen ? '180deg' : '0deg') + ")")}>▾</span>
                        </button>
                        {v.ferr.biz && <span style={cssToStyle("font-size: 12px; color: #E11D48")}>{v.ferr.biz}</span>}

                        {v.bizOpen && (
                          <ul role="listbox" style={cssToStyle("position: absolute; top: calc(100% + 6px); left: 0; right: 0; background: #FFFFFF; border: 1px solid #E1E7E5; border-radius: 14px; box-shadow: 0 18px 44px rgba(11,26,30,0.18); padding: 6px; margin: 0; list-style: none; z-index: 50; max-height: 260px; overflow: auto")}>
                            {v.businessTypes.map((opt, oi) => (
                              <li key={oi}>
                                <button type="button" onClick={() => v.setBiz(opt)} role="option" aria-selected={v.fbiz === opt} style={cssToStyle("display: block; width: 100%; text-align: left; padding: 11px 12px; border-radius: 9px; font-size: 13.5px; background: " + (v.fbiz === opt ? '#EAF7F1' : 'transparent') + "; color: #0B1A1E; cursor: pointer; border: 0")}>{opt}</button>
                              </li>
                            ))}
                          </ul>
                        )}

                      </div>`;

if (!dropdownRe.test(src)) {
  console.error('DROPDOWN NOT FOUND');
  process.exit(1);
}
src = src.replace(dropdownRe, replacement);

// Services error message under legend
src = src.replace(
  '>Services I\'m interested in</legend>',
  '>Services I\'m interested in</legend>\n                        {v.ferr.services && <span style={cssToStyle("font-size: 12px; color: #E11D48; display: block; margin-bottom: 4px")}>{v.ferr.services}</span>}'
);

// textarea -> controlled
const textareaRe = /<label style=\{cssToStyle\("display: grid; gap: 6px; font-size: 13px; font-weight: 600"\)\}>Tell us about your requirements\s*<textarea[\s\S]*?<\/label>/;
const textareaHtml = '' +
  '                      <label style={cssToStyle("display: grid; gap: 6px; font-size: 13px; font-weight: 600")}>Tell us about your requirements\n' +
  '                        <textarea name="msg" rows="4" value={v.freq} onChange={v.setFreq} placeholder="Describe your accounting or tax requirements and the support you are looking for..." style={cssToStyle("padding: 12px 14px; min-height: 120px; border-radius: 12px; border: 1.5px solid " + (v.ferr.msg ? '#E11D48' : '#B8C4C1') + "; resize: vertical; font-family: inherit")}></textarea>\n' +
    '                        {v.ferr.msg && <span style={cssToStyle("font-size: 12px; color: #E11D48")}>{v.ferr.msg}</span>}\n' +
    '                      </label>';
if (!textareaRe.test(src)) { console.error('TEXTAREA NOT FOUND'); process.exit(1); }
src = src.replace(textareaRe, textareaHtml);

// Submit button -> loading state + form-level error
src = src.replace(
  '<button type="submit" className="btn btn-ink" style={cssToStyle("justify-content: center; width: 100%")}>Request a Consultation\n                        <span className="arrow" aria-hidden="true">→</span></button>',
  '{v.ferr.form && <div role="alert" style={cssToStyle("font-size: 13px; color: #B91C1C; background: #FEF2F2; border: 1px solid #FECACA; border-radius: 10px; padding: 10px 12px")}>{v.ferr.form}</div>}\n                      <button type="submit" className="btn btn-ink" disabled={v.sending} style={cssToStyle("justify-content: center; width: 100%; opacity: " + (v.sending ? '0.7' : '1') + "; cursor: " + (v.sending ? 'not - allowed' : 'pointer'))}>{v.sending ? 'Submitting Request...' : 'Request a Consultation'}\n                        {!v.sending && <span className="arrow" aria-hidden="true">→</span>}</button>'
);

fs.writeFileSync(p, src);
console.log('OK');

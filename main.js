(() => {
  const event = window.INVITATION_EVENT;
  if (event) {
    const values = { ...event, summary: `${event.date} · ${event.weekday} · ${event.time}` };
    document.querySelectorAll('[data-event]').forEach(node => {
      const value = values[node.dataset.event];
      if (value !== undefined) node.textContent = value;
    });
    document.querySelector('meta[name="description"]').content = `亲爱的学长学姐，诚挚邀请你分享英语四、六级备考经验。${event.date}，${event.weekday}，${event.period}${event.time}，期待与你相聚。`;
  }
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const cover = document.querySelector('#invitation-cover');
  const content = document.querySelector('#invitation-content');
  const reopen = document.querySelector('.reopen-cover');
  let opening = false;
  let closeTimer;
  function showCover() {
    clearTimeout(closeTimer);
    opening = false;
    cover.classList.remove('is-opening');
    content.classList.remove('content-arriving');
    cover.hidden = false;
    cover.removeAttribute('aria-hidden');
    content.inert = true;
    content.setAttribute('aria-hidden', 'true');
    document.body.classList.add('cover-closed');
    cover.scrollTop = 0;
    cover.querySelector('button').focus({ preventScroll: true });
  }
  function openCover() {
    if (opening || cover.hidden) return;
    opening = true;
    document.body.classList.remove('cover-closed');
    content.inert = false;
    content.removeAttribute('aria-hidden');
    window.scrollTo({ top: 0, behavior: 'instant' });
    cover.classList.add('is-opening');
    if (!motion.matches) content.classList.add('content-arriving');
    document.querySelector('#hero-title').focus({ preventScroll: true });
    cover.setAttribute('aria-hidden', 'true');
    history.replaceState(null, '', location.pathname + location.search);
    const finish = () => { cover.hidden = true; cover.removeAttribute('aria-hidden'); opening = false; };
    if (motion.matches) finish();
    else closeTimer = setTimeout(finish, 1100);
  }
  cover.querySelector('button').addEventListener('click', openCover);
  cover.addEventListener('keydown', e => {
    if (['Escape', 'Enter', ' '].includes(e.key)) { e.preventDefault(); openCover(); }
    if (e.key === 'Tab') { e.preventDefault(); cover.querySelector('button').focus(); }
  });
  reopen.hidden = false;
  reopen.addEventListener('click', showCover);
  // 保留正文锚点直达；正常打开页面时先展示封面。无 JS 时正文仍可阅读。
  if (!location.hash) showCover();
  if ('IntersectionObserver' in window && !motion.matches) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    }), { threshold: 0.08 });
    document.querySelectorAll('.reveal').forEach(node => {
      node.classList.add('will-reveal');
      observer.observe(node);
    });
    motion.addEventListener?.('change', () => {
      if (motion.matches) {
        observer.disconnect();
        document.querySelectorAll('.will-reveal').forEach(node => node.classList.add('is-visible'));
      }
    });
  }
  document.querySelector('.open-letter').addEventListener('click', e => {
    e.preventDefault();
    const letter = document.querySelector('#letter');
    letter.focus({ preventScroll: true });
    letter.scrollIntoView({ behavior: motion.matches ? 'auto' : 'smooth', block: 'start' });
    history.replaceState(null, '', '#letter');
  });
})();

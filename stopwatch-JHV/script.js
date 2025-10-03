(() => {
  const doc = document;
  const body = doc.body;
  const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

  const applyMotionPreference = event => {
    const prefersReduced = typeof event.matches === 'boolean' ? event.matches : reduceMotionQuery.matches;
    body.classList.toggle('reduced-motion', prefersReduced);
  };

  applyMotionPreference(reduceMotionQuery);
  if (typeof reduceMotionQuery.addEventListener === 'function') {
    reduceMotionQuery.addEventListener('change', applyMotionPreference);
  } else if (typeof reduceMotionQuery.addListener === 'function') {
    reduceMotionQuery.addListener(applyMotionPreference);
  }

  const formatTime = milliseconds => {
    const safeMs = Math.max(0, milliseconds);
    const totalCentiseconds = Math.floor(safeMs / 10);
    const centiseconds = totalCentiseconds % 100;
    const totalSeconds = Math.floor(totalCentiseconds / 100);
    const seconds = totalSeconds % 60;
    const minutes = Math.floor(totalSeconds / 60);
    const mm = String(minutes).padStart(2, '0');
    const ss = String(seconds).padStart(2, '0');
    const cc = String(centiseconds).padStart(2, '0');
    return `${mm}:${ss}.${cc}`;
  };

  const runAnimationSpark = display => {
    if (body.classList.contains('reduced-motion')) {
      return;
    }
    display.classList.remove('is-spark');
    void display.offsetWidth;
    display.classList.add('is-spark');
    window.setTimeout(() => display.classList.remove('is-spark'), 320);
  };

  const stopwatch = (() => {
    const display = doc.querySelector('[data-stopwatch-display]');
    const startBtn = doc.querySelector('[data-stopwatch-start]');
    const toggleBtn = doc.querySelector('[data-stopwatch-toggle]');
    const resetBtn = doc.querySelector('[data-stopwatch-reset]');
    const stateLabel = doc.getElementById('stopwatch-state');

    const states = {
      idle: 'Listo',
      running: 'En marcha',
      paused: 'Pausado'
    };

    const state = {
      status: 'idle',
      startTime: 0,
      elapsed: 0,
      frameId: null
    };

    const renderDisplay = () => {
      display.textContent = formatTime(state.elapsed);
    };

    const stopAnimationFrame = () => {
      if (state.frameId) {
        cancelAnimationFrame(state.frameId);
        state.frameId = null;
      }
    };

    const setStatus = next => {
      state.status = next;
      stateLabel.textContent = states[next];
      startBtn.setAttribute('aria-pressed', String(next === 'running'));
      const pausePressed = next === 'paused';
      toggleBtn.setAttribute('aria-pressed', String(pausePressed));
      toggleBtn.textContent = pausePressed ? 'Continuar' : 'Pausar';

      startBtn.disabled = next !== 'idle';
      toggleBtn.disabled = next === 'idle';
      resetBtn.disabled = next === 'idle' && state.elapsed === 0;
    };

    const tick = () => {
      state.elapsed = performance.now() - state.startTime;
      renderDisplay();
      state.frameId = requestAnimationFrame(tick);
    };

    const start = () => {
      if (state.status !== 'idle') {
        return;
      }
      state.elapsed = 0;
      state.startTime = performance.now();
      setStatus('running');
      tick();
    };

    const pause = () => {
      if (state.status !== 'running') {
        return;
      }
      stopAnimationFrame();
      state.elapsed = performance.now() - state.startTime;
      setStatus('paused');
    };

    const resume = () => {
      if (state.status !== 'paused') {
        return;
      }
      state.startTime = performance.now() - state.elapsed;
      setStatus('running');
      tick();
    };

    const reset = () => {
      stopAnimationFrame();
      state.elapsed = 0;
      renderDisplay();
      setStatus('idle');
    };

    const refresh = () => {
      if (state.status === 'running') {
        state.elapsed = performance.now() - state.startTime;
        renderDisplay();
      }
    };

    startBtn.addEventListener('click', start);
    toggleBtn.addEventListener('click', () => {
      if (state.status === 'running') {
        pause();
      } else {
        resume();
      }
    });
    resetBtn.addEventListener('click', reset);

    const keyboardHandler = event => {
      if (event.code !== 'Space' && event.key !== ' ') {
        return;
      }
      const target = event.target;
      if (target && target.closest && target.closest('input, textarea')) {
        return;
      }
      event.preventDefault();
      if (state.status === 'idle') {
        start();
      } else if (state.status === 'running') {
        pause();
      } else {
        resume();
      }
    };

    window.addEventListener('keydown', keyboardHandler);

    renderDisplay();
    return {
      pause,
      resume,
      reset,
      start,
      refresh,
      get status() {
        return state.status;
      }
    };
  })();

  const countdown = (() => {
    const minutesInput = doc.querySelector('[data-countdown-minutes]');
    const secondsInput = doc.querySelector('[data-countdown-seconds]');
    const display = doc.querySelector('[data-countdown-display]');
    const progress = doc.querySelector('.countdown__progress');
    const message = doc.querySelector('[data-countdown-message]');
    const startBtn = doc.querySelector('[data-countdown-start]');
    const toggleBtn = doc.querySelector('[data-countdown-toggle]');
    const resetBtn = doc.querySelector('[data-countdown-reset]');
    const stateLabel = doc.getElementById('countdown-state');

    const states = {
      idle: 'Listo',
      running: 'En marcha',
      paused: 'Pausado',
      completed: 'Completado'
    };

    const state = {
      status: 'idle',
      duration: 0,
      remaining: 0,
      endTime: 0,
      frameId: null
    };

    const clampField = value => {
      const parsed = Number.parseInt(value, 10);
      if (Number.isNaN(parsed) || parsed < 0) {
        return 0;
      }
      return Math.min(59, parsed);
    };

    const getDurationFromInputs = () => {
      const minutes = clampField(minutesInput.value);
      const seconds = clampField(secondsInput.value);
      return ((minutes * 60) + seconds) * 1000;
    };

    const sanitiseInputs = () => {
      minutesInput.value = String(clampField(minutesInput.value)).padStart(2, '0');
      secondsInput.value = String(clampField(secondsInput.value)).padStart(2, '0');
    };

    const updateDisplay = value => {
      display.textContent = formatTime(value);
    };

    const updateProgress = () => {
      if (state.duration <= 0) {
        progress.value = 0;
        return;
      }
      const ratio = Math.min(1, Math.max(0, 1 - state.remaining / state.duration));
      progress.value = ratio;
    };

    const setStatus = next => {
      state.status = next;
      stateLabel.textContent = states[next];
      startBtn.setAttribute('aria-pressed', String(next === 'running'));
      const pausePressed = next === 'paused';
      toggleBtn.setAttribute('aria-pressed', String(pausePressed));
      toggleBtn.textContent = pausePressed ? 'Continuar' : 'Pausar';

      const isIdle = next === 'idle';
      const isRunning = next === 'running';

      startBtn.disabled = isRunning || next === 'paused' || next === 'completed';
      toggleBtn.disabled = isIdle || next === 'completed';
      resetBtn.disabled = isIdle;

      const inputsLocked = isRunning || next === 'paused';
      minutesInput.disabled = inputsLocked;
      secondsInput.disabled = inputsLocked;
    };

    const stopFrame = () => {
      if (state.frameId) {
        cancelAnimationFrame(state.frameId);
        state.frameId = null;
      }
    };

    const clearMessage = () => {
      message.textContent = '';
      message.classList.remove('is-alert');
    };

    const showAlert = text => {
      message.textContent = text;
      message.classList.add('is-alert');
    };

    const finish = () => {
      stopFrame();
      state.remaining = 0;
      setStatus('completed');
      updateDisplay(0);
      updateProgress();
      message.textContent = '¡Cuenta atrás finalizada!';
      message.classList.remove('is-alert');
      runAnimationSpark(display);
      if (!body.classList.contains('reduced-motion') && typeof navigator.vibrate === 'function') {
        navigator.vibrate([80, 40, 80]);
      }
    };

    const tick = () => {
      state.remaining = Math.max(0, state.endTime - performance.now());
      updateDisplay(state.remaining);
      updateProgress();

      if (state.remaining <= 0) {
        finish();
        return;
      }

      state.frameId = requestAnimationFrame(tick);
    };

    const start = () => {
      if (state.status === 'running') {
        return;
      }

      sanitiseInputs();
      const duration = getDurationFromInputs();
      if (duration <= 0) {
        showAlert('Configura un tiempo mayor a cero para iniciar la cuenta.');
        runAnimationSpark(display);
        return;
      }

      clearMessage();
      state.duration = duration;
      state.remaining = duration;
      state.endTime = performance.now() + duration;
      setStatus('running');
      tick();
    };

    const pause = () => {
      if (state.status !== 'running') {
        return;
      }
      stopFrame();
      state.remaining = Math.max(0, state.endTime - performance.now());
      setStatus('paused');
    };

    const resume = () => {
      if (state.status !== 'paused') {
        return;
      }
      state.endTime = performance.now() + state.remaining;
      setStatus('running');
      tick();
    };

    const reset = () => {
      stopFrame();
      sanitiseInputs();
      state.duration = getDurationFromInputs();
      state.remaining = state.duration;
      updateDisplay(state.remaining);
      updateProgress();
      clearMessage();
      setStatus('idle');
    };

    const handleToggle = () => {
      if (state.status === 'running') {
        pause();
      } else if (state.status === 'paused') {
        resume();
      }
    };

    const handleInputChange = () => {
      if (state.status === 'running' || state.status === 'paused') {
        return;
      }
      sanitiseInputs();
      state.duration = getDurationFromInputs();
      state.remaining = state.duration;
      updateDisplay(state.duration);
      updateProgress();
    };

    minutesInput.addEventListener('change', handleInputChange);
    minutesInput.addEventListener('blur', handleInputChange);
    secondsInput.addEventListener('change', handleInputChange);
    secondsInput.addEventListener('blur', handleInputChange);

    startBtn.addEventListener('click', start);
    toggleBtn.addEventListener('click', handleToggle);
    resetBtn.addEventListener('click', reset);

    sanitiseInputs();
    const initialDuration = getDurationFromInputs();
    state.duration = initialDuration;
    state.remaining = initialDuration;
    updateDisplay(initialDuration);
    updateProgress();

    const refresh = () => {
      if (state.status === 'running') {
        state.remaining = Math.max(0, state.endTime - performance.now());
        updateDisplay(state.remaining);
        updateProgress();
        if (state.remaining <= 0) {
          finish();
        }
      }
    };

    return {
      start,
      pause,
      resume,
      reset,
      refresh,
      get status() {
        return state.status;
      }
    };
  })();

  doc.addEventListener('visibilitychange', () => {
    if (doc.visibilityState === 'visible') {
      stopwatch.refresh();
      countdown.refresh();
    }
  });
})();

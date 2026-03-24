import { tap, finalize } from 'rxjs/operators';
let activeRequests = 0;
export const loadingInterceptor = (req, next) => {
    if (shouldSkipLoading(req)) {
        return next(req);
    }
    showLoading();
    return next(req).pipe(tap(event => {
        // Handle successful responses if needed
    }), finalize(() => {
        hideLoading();
    }));
};
function shouldSkipLoading(req) {
    const skipEndpoints = ['/api/notifications', '/api/health-check'];
    return skipEndpoints.some(endpoint => req.url.includes(endpoint));
}
function showLoading() {
    activeRequests++;
    if (activeRequests === 1) {
        setGlobalLoading(true);
        showLoadingSpinner();
    }
}
function hideLoading() {
    activeRequests--;
    if (activeRequests === 0) {
        setGlobalLoading(false);
        hideLoadingSpinner();
    }
    if (activeRequests < 0)
        activeRequests = 0;
}
function setGlobalLoading(isLoading) {
    const body = document.body;
    if (isLoading) {
        body.classList.add('loading-active');
    }
    else {
        body.classList.remove('loading-active');
    }
}
function showLoadingSpinner() {
    let spinner = document.getElementById('global-loading-spinner');
    if (!spinner) {
        spinner = document.createElement('div');
        spinner.id = 'global-loading-spinner';
        spinner.innerHTML = `
      <div class="loading-overlay">
        <div class="loading-spinner">
          <div class="spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    `;
        document.body.appendChild(spinner);
    }
    spinner.style.display = 'block';
}
function hideLoadingSpinner() {
    const spinner = document.getElementById('global-loading-spinner');
    if (spinner)
        spinner.style.display = 'none';
}

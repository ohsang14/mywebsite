document.addEventListener('DOMContentLoaded', () => {
    /**
     * ✅ 경로 설정
     */
    const currentPath = window.location.pathname;
    const basePath = currentPath.includes('/about/') ? '../' : './';

    /**
     * ✅ 로그인 상태 UI 업데이트
     */
    function updateAuthUI() {
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        const currentUser = localStorage.getItem('currentUser');

        const loginItem = document.getElementById('loginItem');
        const signupItem = document.getElementById('signupItem');
        const logoutItem = document.getElementById('logoutItem');
        const userWelcome = document.getElementById('userWelcome');
        const currentUserSpan = document.getElementById('currentUser');

        if (!loginItem || !signupItem || !logoutItem || !userWelcome || !currentUserSpan) {
            console.warn('⚠️ UI 요소가 존재하지 않습니다. updateAuthUI 실행 불가');
            return;
        }

        if (isLoggedIn && currentUser) {
            loginItem.classList.add('d-none');
            signupItem.classList.add('d-none');
            logoutItem.classList.remove('d-none');
            userWelcome.classList.remove('d-none');
            currentUserSpan.textContent = currentUser;
        } else {
            loginItem.classList.remove('d-none');
            signupItem.classList.remove('d-none');
            logoutItem.classList.add('d-none');
            userWelcome.classList.add('d-none');
        }
    }

    /**
     * ✅ 로그아웃 이벤트 리스너
     */
    function setupLogoutListener() {
        const logoutLink = document.getElementById('logoutLink');
        if (logoutLink) {
            logoutLink.addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('currentUser');
                alert('✅ 로그아웃 되었습니다.');
                window.location.href = `${basePath}index.html`;
            });
        } else {
            console.warn('⚠️ 로그아웃 링크를 찾을 수 없습니다.');
        }
    }

    /**
     * ✅ 로그인 처리
     */
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('loginUsername').value.trim();
            const password = document.getElementById('loginPassword').value;

            if (localStorage.getItem(username) === password) {
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('currentUser', username);
                alert('✅ 로그인 성공!');
                window.location.href = `${basePath}index.html`;
            } else {
                alert('❌ 아이디 또는 비밀번호가 잘못되었습니다.');
            }
        });
    }

    /**
     * ✅ 회원가입 처리
     */
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('signupUsername').value.trim();
            const password = document.getElementById('signupPassword').value;
            const passwordConfirm = document.getElementById('signupPasswordConfirm').value;
            const termsAgree = document.getElementById('termsAgree').checked;

            // 🛡️ 입력값 검증
            if (!username || !password || !passwordConfirm) {
                alert('❌ 모든 필드를 입력해주세요.');
                return;
            }

            // 🛡️ 비밀번호 검증
            if (password !== passwordConfirm) {
                alert('❌ 비밀번호와 비밀번호 확인이 일치하지 않습니다.');
                return;
            }

            // 🛡️ 약관 동의 확인
            if (!termsAgree) {
                alert('❌ 약관에 동의해야 회원가입이 가능합니다.');
                return;
            }

            // 🛡️ 아이디 중복 확인
            if (localStorage.getItem(username)) {
                alert('❌ 이미 존재하는 아이디입니다.');
                return;
            }

            // ✅ 회원가입 성공
            localStorage.setItem(username, password);
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('currentUser', username);

            alert('✅ 회원가입 성공!');
            window.location.href = `${basePath}login.html`;
        });
    }

    /**
     * ✅ 게시글 저장 기능
     */
    const savePostButton = document.getElementById('savePost');
    if (savePostButton) {
        savePostButton.addEventListener('click', () => {
            const title = document.getElementById('postTitle').value.trim();
            const content = document.getElementById('postContent').value.trim();
            const username = localStorage.getItem('currentUser') || '익명';
            const date = new Date().toLocaleDateString();
            const posts = JSON.parse(localStorage.getItem('boardPosts')) || [];

            if (!title || !content) {
                alert('❌ 제목과 내용을 입력해주세요.');
                return;
            }

            const newPost = {
                title,
                content,
                username,
                date,
                views: 0,
            };

            posts.push(newPost);
            localStorage.setItem('boardPosts', JSON.stringify(posts));

            alert('✅ 게시글이 등록되었습니다.');
            window.location.reload();
        });
    }

    /**
     * ✅ 슬라이드(캐러셀) 초기화
     */
    function initializeCarousel() {
        const carouselElement = document.querySelector('#carouselExample');
        if (carouselElement) {
            const carousel = new bootstrap.Carousel(carouselElement, {
                interval: 2000,
                ride: 'carousel'
            });
            console.log('✅ 캐러셀이 초기화되었습니다.');
        } else {
            console.warn('⚠️ 캐러셀 요소를 찾을 수 없습니다.');
        }
    }

    /**
     * ✅ 헤더 및 푸터 동적 로드
     */
    function loadFragment(selector, url, callback) {
        fetch(url)
            .then(response => {
                if (!response.ok) throw new Error(`${url} 파일을 불러오지 못했습니다.`);
                return response.text();
            })
            .then(data => {
                document.getElementById(selector).innerHTML = data;
                if (callback) callback();
            })
            .catch(error => {
                console.error(`Error loading ${url}:`, error);
            });
    }

    /**
     * ✅ 모든 요소 로드 후 실행
     */
    if (document.getElementById('header')) {
        loadFragment('header', `${basePath}header.html`, () => {
            updateAuthUI();
            setupLogoutListener();
            initializeCarousel(); // 헤더가 로드된 후 캐러셀 초기화
        });
    } else {
        updateAuthUI();
        setupLogoutListener();
        initializeCarousel();
    }

    if (document.getElementById('footer')) {
        loadFragment('footer', `${basePath}footer.html`);
    }
});

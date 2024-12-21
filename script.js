document.addEventListener('DOMContentLoaded', () => {
    // ✅ 요소 참조
    let loginItem, signupItem, logoutItem, userWelcome, currentUserSpan;

    /**
     * ✅ 로그인 상태 UI 업데이트
     */
    function updateAuthUI() {
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        const currentUser = localStorage.getItem('currentUser');

        // 요소가 존재하는지 다시 확인
        loginItem = document.getElementById('loginItem');
        signupItem = document.getElementById('signupItem');
        logoutItem = document.getElementById('logoutItem');
        userWelcome = document.getElementById('userWelcome');
        currentUserSpan = document.getElementById('currentUser');

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
     * ✅ 로그인 처리
     */
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('loginUsername').value;
            const password = document.getElementById('loginPassword').value;

            if (localStorage.getItem(username) === password) {
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('currentUser', username);
                alert('✅ 로그인 성공!');
                window.location.href = 'index.html';
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
            const username = document.getElementById('signupUsername').value;
            const password = document.getElementById('signupPassword').value;

            if (localStorage.getItem(username)) {
                alert('❌ 이미 존재하는 아이디입니다.');
            } else {
                localStorage.setItem(username, password);
                alert('✅ 회원가입 성공!');
                window.location.href = 'login.html';
            }
        });
    }

    /**
     * ✅ 로그아웃 처리
     */
    const logoutLink = document.getElementById('logoutLink');
    if (logoutLink) {
        logoutLink.addEventListener('click', () => {
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('currentUser');
            window.location.href = 'index.html';
        });
    }

    /**
     * ✅ 드롭다운 메뉴 이벤트
     */
    document.querySelectorAll('.navbar-nav .nav-item').forEach(item => {
        const dropdown = item.querySelector('.dep2');
        if (dropdown) {
            item.addEventListener('mouseover', () => dropdown.style.display = 'block');
            item.addEventListener('mouseout', () => dropdown.style.display = 'none');
        }
    });

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
                if (callback) callback(); // 콜백 함수 호출
            })
            .catch(error => {
                console.error(`Error loading ${url}:`, error);
            });
    }

    /**
     * ✅ 헤더와 푸터 로드 및 로그인 상태 확인
     */
    if (document.getElementById('header')) {
        loadFragment('header', 'header.html', () => {
            // ✅ 헤더 로드 완료 후 로그인 상태 업데이트
            updateAuthUI();
        });
    } else {
        updateAuthUI(); // 헤더가 없을 경우에도 상태 업데이트
    }

    if (document.getElementById('footer')) {
        loadFragment('footer', 'footer.html');
    }
});

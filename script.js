document.addEventListener('DOMContentLoaded', () => {

    const currentPath = window.location.pathname;
    const basePath = currentPath.includes('/about/') ? '../' : './';


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


    function setupLogoutListener() {
        const logoutLink = document.getElementById('logoutLink');
        if (logoutLink) {
            logoutLink.addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('currentUser');
                alert('✅ 로그아웃 되었습니다.');
                window.location.href = `${basePath}index.html`; // 동적 경로
            });
        } else {
            console.warn('⚠️ 로그아웃 링크를 찾을 수 없습니다.');
        }
    }


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
                window.location.href = `${basePath}index.html`;
            } else {
                alert('❌ 아이디 또는 비밀번호가 잘못되었습니다.');
            }
        });
    }


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
                window.location.href = `${basePath}login.html`;
            }
        });
    }


    document.querySelectorAll('.navbar-nav .nav-item').forEach(item => {
        const dropdown = item.querySelector('.dep2');
        if (dropdown) {
            item.addEventListener('mouseover', () => dropdown.style.display = 'block');
            item.addEventListener('mouseout', () => dropdown.style.display = 'none');
        }
    });


    function loadFragment(selector, url, callback) {
        fetch(url)
            .then(response => {
                if (!response.ok) throw new Error(`${url} 파일을 불러오지 못했습니다.`);
                return response.text();
            })
            .then(data => {
                document.getElementById(selector).innerHTML = data;
                if (callback) callback(); // 콜백 함수 실행
            })
            .catch(error => {
                console.error(`Error loading ${url}:`, error);
            });
    }


    if (document.getElementById('header')) {
        loadFragment('header', `${basePath}header.html`, () => {
            updateAuthUI(); // ✅ 헤더 로드 후 로그인 상태 업데이트
            setupLogoutListener(); // ✅ 로그아웃 리스너 등록
        });
    } else {
        updateAuthUI();
        setupLogoutListener();
    }

    if (document.getElementById('footer')) {
        loadFragment('footer', `${basePath}footer.html`);
    }
});

const faqSavePostButton = document.getElementById('faqSavePost');

if (faqSavePostButton) {
    faqSavePostButton.addEventListener('click', () => {
        const title = document.getElementById('faqPostTitle').value.trim();
        const content = document.getElementById('faqPostContent').value.trim();
        const author = localStorage.getItem('currentUser') || '익명';
        const date = new Date().toLocaleDateString();
        const views = 0;

        if (!title || !content) {
            alert('❌ 제목과 내용을 모두 입력해주세요.');
            return;
        }

        const newPost = { title, content, author, date, views };
        const faqPosts = JSON.parse(localStorage.getItem('faqPosts')) || [];
        faqPosts.push(newPost);
        localStorage.setItem('faqPosts', JSON.stringify(faqPosts));

        alert('✅ 글이 성공적으로 등록되었습니다.');
        document.getElementById('faqPostTitle').value = '';
        document.getElementById('faqPostContent').value = '';
        const writeModal = bootstrap.Modal.getInstance(document.getElementById('writeModal'));
        writeModal.hide();
        renderFaqPosts();
    });
} else {
    console.warn('⚠️ 글쓰기 버튼(#faqSavePost)을 찾을 수 없습니다.');
}
// Bold the currently active page
const navLinks = document.querySelectorAll('.nav-lhs')
for (let nav of navLinks) {
    if (nav.pathname === document.location.pathname) {
        nav.className += ' active'
    }
}
// Check if we are currently inside the /p/ folder
let isSubPage = window.location.pathname.includes('/p/');
let prefix = isSubPage ? '../' : '';

// Fetch nav.html from the root
fetch(prefix + 'nav.html')
  .then(res => {
    if (!res.ok) throw new Error('Nav not found');
    return res.text();
  })
  .then(text => {
    let oldelem = document.querySelector("script#navbar");
    let newelem = document.createElement("div");
    newelem.innerHTML = text;
    oldelem.parentNode.replaceChild(newelem, oldelem);

    // Load nav.css from the root css folder
    let navStyle = document.createElement("link");
    navStyle.rel = "stylesheet";
    navStyle.href = prefix + "css/nav.css"; 
    document.head.appendChild(navStyle);

    let currentPath = window.location.pathname;
    let currentPage = currentPath.split("/").pop() || "index.html";
    let navLinks = document.querySelectorAll('ul.nav a');

    navLinks.forEach(link => {
      let linkHref = link.getAttribute('href');
      
      // If the link in nav.html is "index.html", but we are in /p/, 
      // we need to fix the link to point to "../index.html"
      if (isSubPage && !linkHref.startsWith('http') && !linkHref.startsWith('/p/')) {
          link.setAttribute('href', '../' + linkHref);
      }

      let normalizedLink = linkHref.replace(/^\/p\//, '').replace(/^\//, '');
      let normalizedPage = currentPage.replace(/^\/p\//, '').replace(/^\//, '');

      if (normalizedLink === normalizedPage) {
        link.classList.add('nav_active');
      }
    });
  })
  .catch(err => console.error('Error loading navigation:', err));
// This function finds the root of your project (advsite-v4)
// by looking for the "p" folder or current depth.
let path = window.location.pathname;
let isSubPage = path.includes('/p/');
let rootPrefix = isSubPage ? '../' : '';

fetch(rootPrefix + 'nav.html')
  .then(response => {
    if (!response.ok) throw new Error("Could not find nav.html");
    return response.text();
  })
  .then(data => {
    let oldelem = document.querySelector("script#navbar");
    let newelem = document.createElement("div");
    newelem.innerHTML = data;
    oldelem.parentNode.replaceChild(newelem, oldelem);

    // 1. Link the CSS from the /css/ folder
    let navStyle = document.createElement("link");
    navStyle.rel = "stylesheet";
    navStyle.href = rootPrefix + "css/nav.css";
    document.head.appendChild(navStyle);

    // 2. Fix the links inside the nav so they work from subfolders
    let navLinks = newelem.querySelectorAll('a');
    navLinks.forEach(link => {
      let href = link.getAttribute('href');
      
      // If we are in /p/, and the link doesn't go to another subpage, add ../
      if (isSubPage && !href.startsWith('http') && !href.startsWith('p/') && !href.startsWith('../')) {
        link.setAttribute('href', rootPrefix + href);
      }
    });

    // 3. Set Active Class
    let currentPage = path.split("/").pop() || "index.html";
    navLinks.forEach(link => {
      if (link.getAttribute('href').includes(currentPage)) {
        link.classList.add('nav_active');
      }
    });
  })
  .catch(err => console.error("Navbar error:", err));
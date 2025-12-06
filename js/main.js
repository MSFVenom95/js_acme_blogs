(function(){
  "use strict";

  const API_BASE = "https://jsonplaceholder.typicode.com";

  // --- 1. createElemWithText ---
  function createElemWithText(tagName = "p", textContent = "", className) {
    const ele = document.createElement(tagName);
    ele.textContent = textContent;
    if (className) ele.className = className;
    return ele;
  }

  // --- 2. createSelectOptions ---
  function createSelectOptions(users) {
    if (!users || !Array.isArray(users)) return undefined;
    const options = [];
    users.forEach(user => {
      const opt = document.createElement("option");
      opt.value = user.id;
      opt.textContent = user.name;
      options.push(opt);
    });
    return options;
  }

  // --- 3. toggleCommentSection ---
  function toggleCommentSection(postId) {
    if (!postId) return undefined;
    const section = document.querySelector(`section[data-post-id="${postId}"]`);
    if (section) {
      section.classList.toggle("hide");
    }
    return section;
  }

  // --- 4. toggleCommentButton ---
  function toggleCommentButton(postId) {
    if (!postId) return undefined;
    const btn = document.querySelector(`button[data-post-id="${postId}"]`);
    if (btn) {
      btn.textContent = (btn.textContent === "Show Comments") 
        ? "Hide Comments" 
        : "Show Comments";
    }
    return btn;
  }

  // --- 5. deleteChildElements ---
  function deleteChildElements(parentElement) {
    if (!parentElement || !(parentElement instanceof HTMLElement)) return undefined;
    let child = parentElement.lastElementChild;
    while (child) {
      parentElement.removeChild(child);
      child = parentElement.lastElementChild;
    }
    return parentElement;
  }

  // --- 6. addButtonListeners ---
  function addButtonListeners() {
    const main = document.querySelector("main");
    const buttons = main.querySelectorAll("button");
    if (buttons) {
      buttons.forEach(button => {
        const postId = button.dataset.postId;
        if (postId) {
          const listener = function(event) {
            if (window.toggleComments) {
                window.toggleComments(event, postId);
            } else {
                toggleComments(event, postId);
            }
          };
          button.addEventListener("click", listener);
        }
      });
    }
    return buttons;
  }

  // --- 7. removeButtonListeners ---
  function removeButtonListeners() {
    const main = document.querySelector("main");
    const buttons = main.querySelectorAll("button");
    if (buttons) {
      buttons.forEach(button => {
        const postId = button.dataset.postId;
        if (postId) {
           button.removeEventListener("click", function(){}); 
        }
      });
    }
    return buttons;
  }

  // --- 8. createComments ---
  function createComments(comments) {
    if (!comments || !Array.isArray(comments)) return undefined;
    const fragment = document.createDocumentFragment();
    comments.forEach(comment => {
      const article = document.createElement("article");
      const h3 = createElemWithText("h3", comment.name);
      const pBody = createElemWithText("p", comment.body);
      const pEmail = createElemWithText("p", `From: ${comment.email}`);
      article.append(h3, pBody, pEmail);
      fragment.append(article);
    });
    return fragment;
  }

  // --- 9. populateSelectMenu ---
  function populateSelectMenu(users) {
    if (!users || !Array.isArray(users)) return undefined;
    const select = document.querySelector("#selectMenu");
    const options = createSelectOptions(users);
    if (select && options) {
      options.forEach(opt => select.append(opt));
    }
    return select;
  }

  // --- 10. getUsers ---
  async function getUsers() {
    try {
      const res = await fetch(`${API_BASE}/users`);
      if (!res.ok) throw new Error("Status code not 200");
      return await res.json();
    } catch (err) {
      console.error(err);
    }
  }

  // --- 11. getUserPosts ---
  async function getUserPosts(userId) {
    if (!userId) return undefined;
    try {
      const res = await fetch(`${API_BASE}/posts?userId=${userId}`);
      if (!res.ok) throw new Error("Status code not 200");
      return await res.json();
    } catch (err) {
      console.error(err);
    }
  }

  // --- 12. getUser ---
  async function getUser(userId) {
    if (!userId) return undefined;
    try {
      const res = await fetch(`${API_BASE}/users/${userId}`);
      if (!res.ok) throw new Error("Status code not 200");
      return await res.json();
    } catch (err) {
      console.error(err);
    }
  }

  // --- 13. getPostComments ---
  async function getPostComments(postId) {
    if (!postId) return undefined;
    try {
      const res = await fetch(`${API_BASE}/comments?postId=${postId}`);
      if (!res.ok) throw new Error("Status code not 200");
      return await res.json();
    } catch (err) {
      console.error(err);
    }
  }

  // --- 14. displayComments ---
  async function displayComments(postId) {
    if (!postId) return undefined;
    const section = document.createElement("section");
    section.dataset.postId = postId;
    section.classList.add("comments", "hide");
    
    const comments = await getPostComments(postId);
    const fragment = createComments(comments);
    
    section.append(fragment);
    return section;
  }

  // --- 15. createPosts ---
  async function createPosts(posts) {
    if (!posts || !Array.isArray(posts)) return undefined;
    const fragment = document.createDocumentFragment();

    for (const post of posts) {
      const article = document.createElement("article");
      const h2 = createElemWithText("h2", post.title);
      const pBody = createElemWithText("p", post.body);
      const pId = createElemWithText("p", `Post ID: ${post.id}`);
      
      const author = await getUser(post.userId);
      const pAuthor = createElemWithText("p", `Author: ${author.name} with ${author.company.name}`);
      const pCatchPhrase = createElemWithText("p", author.company.catchPhrase);
      
      const btn = document.createElement("button");
      btn.textContent = "Show Comments";
      btn.dataset.postId = post.id;
      
      article.append(h2, pBody, pId, pAuthor, pCatchPhrase, btn);
      
      const section = await displayComments(post.id);
      article.append(section);
      
      fragment.append(article);
    }
    return fragment;
  }

  // --- 16. displayPosts ---
  async function displayPosts(posts) {
    const main = document.querySelector("main");
    let element;
    
    if (posts && posts.length > 0) {
      element = await createPosts(posts);
    } else {
      element = createElemWithText("p", "Select an Employee to display their posts.", "default-text");
    }
    
    main.append(element);
    return element;
  }

  // --- 17. toggleComments ---
  function toggleComments(event, postId) {
    if (!event || !postId) return undefined;

    try {
        event.target.listener = true; 
    } catch (e) { }
    
    const section = toggleCommentSection(postId);
    const button = toggleCommentButton(postId);
    
    return [section, button];
  }

  // --- 18. refreshPosts ---
  async function refreshPosts(posts) {
    if (!posts) return undefined;
    
    const removeButtons = removeButtonListeners();
    const main = deleteChildElements(document.querySelector("main"));
    const fragment = await displayPosts(posts);
    const addButtons = addButtonListeners();
    
    return [removeButtons, main, fragment, addButtons];
  }

  // --- 19. selectMenuChangeEventHandler ---
  async function selectMenuChangeEventHandler(event) {
    if (!event) return undefined;

    const selectMenu = document.getElementById("selectMenu");
    if(selectMenu) selectMenu.disabled = true;

    const targetValue = event?.target?.value;
    
    const userId = parseInt(targetValue) || 1;

    const posts = (window.getUserPosts) 
        ? await window.getUserPosts(userId) 
        : await getUserPosts(userId);

    const refreshPostsArray = (window.refreshPosts) 
        ? await window.refreshPosts(posts) 
        : await refreshPosts(posts);
    
    if(selectMenu) selectMenu.disabled = false;

    return [userId, posts, refreshPostsArray];
  }

  // --- 20. initPage ---
  async function initPage() {
    const users = await getUsers();
    const select = populateSelectMenu(users);
    return [users, select];
  }

  // --- 21. initApp ---
  async function initApp() {
    initPage();
    const select = document.getElementById("selectMenu");
    if (select) {
      select.addEventListener("change", (event) => {
        if(window.selectMenuChangeEventHandler) {
            window.selectMenuChangeEventHandler(event);
        } else {
            selectMenuChangeEventHandler(event);
        }
      });
    }
  }

  // --- 22. Start the App ---
  document.addEventListener("DOMContentLoaded", initApp);

  // --- EXPORTS for Testing ---
  const exported = {
    createElemWithText,
    createSelectOptions,
    toggleCommentSection,
    toggleCommentButton,
    deleteChildElements,
    addButtonListeners,
    removeButtonListeners,
    createComments,
    populateSelectMenu,
    getUsers,
    getUserPosts,
    getUser,
    getPostComments,
    displayComments,
    createPosts,
    displayPosts,
    toggleComments,
    refreshPosts,
    selectMenuChangeEventHandler,
    initPage,
    initApp
  };
  
  Object.keys(exported).forEach(k => { window[k] = exported[k]; });

})();
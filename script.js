const categoryContainer = document.getElementById("categories-container");
categoryContainer.innerHTML = "";
const newsContainer = document.getElementById("news-container");

const modal = document.getElementById("news-modal");
const modalContent = document.getElementById("modal-content");
const modalClose = document.getElementById("modal-close");

// 🔹 global bookmark array
let bookmarks = [];

const loadCategories = () => {
  showLoading();
  fetch("https://news-api-fs.vercel.app/api/categories")
    .then((res) => res.json())
    .then((data) => {
      const categories = data.categories;
      showCategories(categories);
    });
};

const showCategories = (categories) => {
  categories.forEach((category) => {
    categoryContainer.innerHTML += `
        <li id=${category.id} class="cursor-pointer border-red-600 hover:border-b-4 ">${category.title}
        </li>
    `;
  });

  const firstLi = categoryContainer.querySelector("li");
  if (firstLi) {
    firstLi.classList.add("border-b-4");
  }

  categoryContainer.addEventListener("click", (e) => {
    const allLi = document.querySelectorAll("li");

    allLi.forEach((li) => {
      li.classList.remove("border-b-4");
    });
    if (e.target.localName === "li") {
      e.target.classList.add("border-b-4");
      loadNewsByCategory(e.target.id);
    }
  });
};

const loadNewsByCategory = (categoryId) => {
  showLoading();
  const url = `https://news-api-fs.vercel.app/api/categories/${categoryId}`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      showNewsByCategory(data.articles);
    })
    .catch((error) => {
      showError();
      alert("Something went wrong");
    });
};

const showNewsByCategory = (articles) => {
  if (articles.length === 0) {
    showEmptyMessage();
    alert("There are no news in This Category");
    return;
  }
  newsContainer.innerHTML = "";

  articles.forEach((article) => {
    const newsDiv = document.createElement("div");
    newsDiv.innerHTML = `
        <div class="border border-gray-100 rounded-lg shadow-sm">
            <div class="p-5">
                <div class="">
                    <img class="rounded-sm w-full h-[150px] object-cover" src="${article.image.srcset[5].url}"/>
                </div>
                <div id="${article.id}" class="py-4">
                    <h1 class="font-extrabold">${article.title}</h1>
                    <p class="text-sm py-3">${article.time}</p>
                    <button class="book-mark-btn btn">Bookmark</button>
                    <button class="detail-news-btn btn">View Details</button>
                </div>
            </div>
        </div>      
    `;
    newsContainer.append(newsDiv);

    // 🔹 bookmark
    const bookMarkBtn = newsDiv.querySelector(".book-mark-btn");
    bookMarkBtn.addEventListener("click", () => addToBookMark(article));

    // 🔹 details modal
    const detailBtn = newsDiv.querySelector(".detail-news-btn");
    detailBtn.addEventListener("click", () => openModal(article));
  });
};

// 🔹 open modal
const openModal = (article) => {
  modalContent.innerHTML = `
    <h2 class="text-2xl font-bold mb-3">${article.title}</h2>
    <img class="w-full h-[200px] object-cover rounded mb-3" src="${
      article.image.srcset[5].url
    }" />
    <p class="text-gray-700 mb-3">${article.time}</p>
    <p class="text-gray-600">${
      article.description || "No description available"
    }</p>
  `;
  modal.classList.remove("hidden");
};

// 🔹 close modal
modalClose.addEventListener("click", () => {
  modal.classList.add("hidden");
});

// 🔹 close when background click
modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.add("hidden");
  }
});

// 🔹 add to bookmark
const addToBookMark = (article) => {
  // check duplicate
  if (bookmarks.find((b) => b.id === article.id)) {
    alert("Already bookmarked!");
    return;
  }

  bookmarks.push(article);
  showBookmarks();
};

// 🔹 show bookmarks with delete + count
const showBookmarks = () => {
  const bookMarkContainer = document.getElementById("book-mark-container");
  bookMarkContainer.innerHTML = "";

  bookmarks.forEach((article, index) => {
    const bookMarkDiv = document.createElement("div");
    bookMarkDiv.innerHTML = ` 
      <div class="border border-gray-200 rounded-lg  p-4 mt-3 m-5">
        <p class="font-bold text-lg">${article.title}</p>
        <button class="delete-btn cursor-pointer bg-red-500 mt-3 text-white px-3 py-1 rounded" data-index="${index}">
          Delete
        </button>
      </div>
    `;
    bookMarkContainer.append(bookMarkDiv);
  });

  // update count
  const countSpan = document.getElementById("bookmark-count");
  if (countSpan) {
    countSpan.innerText = bookmarks.length;
  }

  // delete buttons
  const deleteBtns = bookMarkContainer.querySelectorAll(".delete-btn");
  deleteBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const index = e.target.getAttribute("data-index");
      deleteBookmark(index);
    });
  });
};

// 🔹 delete bookmark
const deleteBookmark = (index) => {
  bookmarks.splice(index, 1);
  showBookmarks();
};

const showLoading = () => {
  newsContainer.innerHTML = `
    <div class=" p-5 bg-gray-400">
        <h1 class="text-xl  text-red-700">Loading.....
            <span class="loading loading-ring loading-xs"></span>
            <span class="loading loading-ring loading-sm"></span>
            <span class="loading loading-ring loading-lg"></span>
            <span class="loading loading-ring loading-xl"></span>
      </div>
  `;
};

const showError = () => {
  newsContainer.innerHTML = `
  <div class="bg-red-500 p-7 rounded text-white text-xl font-semibold">
    Something went wrong
  </div>
  `;
};

const showEmptyMessage = () => {
  newsContainer.innerHTML = `
    <div class="bg-gray-400 rounded-xl p-7 text-red-600 text-xl   font-semibold">
      No News Found for This category.
    </div>
  `;
};

// initial load
loadNewsByCategory("main");
loadCategories();

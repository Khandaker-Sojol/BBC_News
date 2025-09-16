const categoryContainer = document.getElementById("categories-container");
categoryContainer.innerHTML = "";

const newsContainer = document.getElementById("news-container");
const loadCategories = () => {
  fetch("https://news-api-fs.vercel.app/api/categories")
    .then((res) => res.json())
    .then((data) => {
      const categories = data.categories;
      showCategories(categories);
    });
};

const showCategories = (categories) => {
  //   console.log(categories);

  categories.forEach((category) => {
    console.log(category);

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
    console.log(e.target);

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
  console.log(categoryId);

  const url = `https://news-api-fs.vercel.app/api/categories/${categoryId}`;
  console.log(url);
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      showNewsByCategory(data.articles);
    });
};

const showNewsByCategory = (articles) => {
  console.log(articles);
  newsContainer.innerHTML = "";

  articles.forEach((article) => {
    newsContainer.innerHTML += `
        <div class="border  border-gray-100 rounded-lg shadow-sm">
            <div class="p-5">
                <div class="">
                    <img class="rounded-sm w-full h-[200px] object-cover" src="${article.image.srcset[5].url}"/>
                </div>
                <div id="${article.id}" class="py-4">
                    <h1 class="font-extrabold">${article.title}</h1>
                    <p class="text-sm py-3">${article.time}</p>
                    <button class="btn">Bookmark</button>
                    <button class="btn">View Details</button>
                </div>
            </div>
        </div>      
    `;
  });
  //   newsContainer.innerHTML += `
  //     <h1>Hi am</h1>
  //   `;
};

loadNewsByCategory("main");
loadCategories();
showNewsByCategory();

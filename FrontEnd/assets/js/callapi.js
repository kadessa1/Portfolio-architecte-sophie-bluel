get_category();
get_works();

//response API to get category
function get_category() {
  const url2 = 'http://localhost:5678/api/categories';
  fetch(url2)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      const fragment = document.createDocumentFragment();
      let categoryies = data;
      localStorage.setItem('categoryies', JSON.stringify(data));
      categoryies.forEach((category) => {
        const link = document.createElement('a');
        link.textContent = category.name;
        link.onclick = function () {
          findWorksBycategory(this, category.id);
        };
        link.classList.add("subcat");
        fragment.appendChild(link);
      });
      const categorie = document.getElementById('category');
      categorie.appendChild(fragment);
    })
}

function findWorksBycategory(event, id = null) {
  const works = JSON.parse(localStorage.getItem('worksedit'));
  let worksList = [];

  if (id !== null) {
    works.forEach((work) => {
      if (work.categoryId == id) {
        worksList.push(work);
      }
    });
  } else {
    worksList = works;
  }
  
  const elements = document.querySelectorAll(".subcat");
  elements.forEach((element) => {
  element.classList.remove("active");
  });
  event.classList.add("active");
  createDocumentWorks(worksList);
}

function get_works() {
  const url = 'http://localhost:5678/api/works';

  fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      const fragment = document.createDocumentFragment();
      let works = data;
      localStorage.setItem('worksedit', JSON.stringify(data));
      createDocumentWorks(works);
    })
}

function createDocumentWorks(works) {
  const fragment = document.createDocumentFragment();
  const gallery = document.getElementById('galleryworks');
  gallery.innerHTML = '';
  works.forEach((work) => {
    const figure = document.createElement('figure');
    const div = document.createElement('div');
    const img = document.createElement('img');
    img.src = work.imageUrl;
    img.crossOrigin = 'anonymous';
    const caption = document.createElement('figcaption');
    caption.textContent = work.title;
    fragment.appendChild(figure);
    figure.appendChild(div);
    div.appendChild(img);
    div.appendChild(caption);
  });
  gallery.appendChild(fragment);

}

function updateWorks() {
  showModal('worksModal');

  const fragment = document.createDocumentFragment();
  const galleryEdit = document.getElementById('gallery_edit');
  galleryEdit.innerHTML = '';

  const works = JSON.parse(localStorage.getItem('worksedit'));

  works.forEach((work) => {
    const div = document.createElement('div');
    div.id = "gallery_edit_img";

    const img = document.createElement('img');
    img.src = work.imageUrl;
    img.crossOrigin = 'anonymous';
    div.appendChild(img);

    const i = document.createElement('i');
    i.setAttribute("class", "fa fa-trash");
    i.setAttribute("data-id", work.id);
    i.setAttribute("onclick", "deleteWork(this, " + work.id + ")");
    div.appendChild(i);

    const p = document.createElement('p');
    p.textContent = 'éditer';
    p.setAttribute("data-id", work.id);
    div.appendChild(p);

    fragment.appendChild(div);
  });

  galleryEdit.appendChild(fragment);
}

function newWork() {
  closeModal();
  const categoryies = JSON.parse(localStorage.getItem('categoryies'));

  let categoryiesOptionHtml = '<option value="">--Veuillez choisir une catégorie--</option>';
  categoryies.forEach((category) => {
    categoryiesOptionHtml += '<option value=' + category['id'] + '>' + category['name'] + '</option>';
  });

  document.getElementById('categories_select').innerHTML = categoryiesOptionHtml;

  showModal('newWorkModal');
}

function getAuthorization() {
  const token = JSON.parse(localStorage.getItem('auth')).token;
  return 'Bearer ' + token;
}

function addWork() {

  const formData = new FormData();

  const titre = document.querySelector("#titre").value;

  const categorie = document.querySelector("#categories_select").value;
  const fileField = document.querySelector('input[type="file"]');

  if (fileField.files[0] == undefined) {
    const alert = document.getElementById('message_alert');
    alert.innerHTML = "veuillez inserer l'image du projet";
    alert.style.display = "block";
    setTimeout(function () { alert.style.display = "none"; }, 3000);
    return false;
  }

  if(titre === "" || categorie === ""){
    debugger
    const alert = document.getElementById('message_alert');
    alert.innerHTML = `veuillez inserer les elements: <i style="font-weight: 800;text-decoration: underline;">${titre !== "" ? "" : "titre"}</i> <i style="font-weight: 800;text-decoration: underline;">${categorie !== "" ? "" : " categorie"}</i>  du projet`;
    alert.style.display = "block";
    setTimeout(function () { alert.style.display = "none"; }, 3000);
    return false;
  }

  formData.append('title', titre);
  formData.append('category', categorie);
  formData.append('image', fileField.files[0]);

  const url = 'http://localhost:5678/api/works';
  const userId = JSON.parse(localStorage.getItem('auth')).userId;

  fetch(url, {
    method: "POST",
    headers: {
      'Authorization': getAuthorization()
    },
    auth: {
      'userId': userId
    },
    body: formData,
    file: {
      'filename': fileField.files[0]
    }
  })
    .then((response) => response.json())
    .then((data) => {
      const listWorks = JSON.parse(localStorage.getItem('worksedit'));
      listWorks.push(data);
      localStorage.setItem('worksedit', JSON.stringify(listWorks));
      closeModal();
      updateWorks();

      const alert = document.getElementById('alert');
      alert.innerHTML = "Votre photo a été ajouté avec succès";
      alert.style.display = "block";
      get_works();
      setTimeout(function () { alert.style.display = "none"; }, 3000);

    })
    .catch((error) => {
      console.error('Error:', error);
    });
  ;
}

function deleteWork(event, id) {
  fetch('http://localhost:5678/api/works/' + id, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': getAuthorization()
    },
    params: {
      'id': id
    },
  })

    .then(() => {
      const parentDiv = event.parentNode;
      parentDiv.remove();
      const alert = document.getElementById('alert');
      alert.innerHTML = "Votre photo a été supprimé avec succès";
      alert.style.display = "block";
      get_works();
      setTimeout(function () { alert.style.display = "none"; }, 3000);

    })
    .catch((error) => {
      console.error('Error:', error);
    });
  ;
}

function deleteAllWorks() {


}


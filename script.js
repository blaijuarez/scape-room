$(document).ready(function () {
  var codigos = JSON.parse(sessionStorage.getItem("codigos") || "{}");

  Object.values(codigos).forEach(({ codigo, link }) => {
    var element = document.querySelector(`li[data-link="${link}"]`);
    element && element.setAttribute("hecho", true);
    element && (element.innerHTML = codigo);
  });

  $("footer ul li:not([hecho])").each(function (_, element) {
    var link = `/${element.dataset.link}/`;
    console.log(link, element);

    $(element).click(function () {
      document.location.href = link;
    });
  });
});

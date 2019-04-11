$("#user-sign-up").on("submit", function(e) {
  e.preventDefault();
  $.ajax({
    method: "POST",
    url: "/api/signup",
    data: {
      email: $("#email")
        .val()
        .trim(),
      password: $("#password")
        .val()
        .trim()
    }
  })
    .then(function(data) {
      console.log(data);
      window.location.replace(data);
    })
    .catch(function(err) {
      var res = JSON.parse(err.responseText);
      var output = "";
      for (let i=0;i<res.errors.length;i++) {
        output+=res.errors[i].message+". ";
      }
      alert(output);
    });
});

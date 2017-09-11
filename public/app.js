$(document).ready(function(){

//VUE COMPONENTS

// NAVBAR
Vue.component('cigar-navbar',{
    template: `
    <nav class="navbar navbar-toggleable-md navbar-light bg-faded">
          <a class="navbar-brand" href="/html/lounge.html">
            <img src="/imgs/Cigar Lounge App.jpg" id="nav_logo" class="d-inline-block align-top" alt="">
          </a>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav mr-auto">
              <li class="nav-item">
                <a class="nav-link" href="/html/lounge.html">{{nav1}}</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#">{{nav2}}</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#">{{nav3}}</a>
              </li>
            </ul>
              <button class="btn btn-outline-success my-2 my-sm-0" type="logout">{{logout}}</button>
          </div>
    </nav>
    `,
    props: ['nav1',
    'nav2',
    'nav3',
    'logout',
    ]
});



// FOOTER
Vue.component('lounge-footer', {
    template: `<footer>
        <p class="text-center">{{footerCopy}}</p>
    </footer>`,
    props: [
        'footer-copy',
    ]
});

// VUE APP
var mainVm = new Vue({el: '#lounge_app'});

});

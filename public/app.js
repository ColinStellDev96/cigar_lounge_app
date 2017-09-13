$(document).ready(function(){

//VUE COMPONENTS
// NAVBAR
Vue.component('cigar-navbar',{
    template: `
    <nav class="navbar navbar-toggleable-md navbar-light bg-faded">
          <router-link class="navbar-brand" to="/lounge">
            <img src="/imgs/Cigar Lounge App.jpg" id="nav_logo" class="d-inline-block align-top" alt="">
        </router-link>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav mr-auto">
              <li class="nav-item">
                <router-link class="nav-link" to="/lounge">{{nav1}}</router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link" to="/humidor">{{nav2}}</router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link" to="#">{{nav3}}</router-link>
              </li>
            </ul>
              <a href="/logout"><button id="logout-btn" class="btn btn-outline-success my-2 my-sm-0" type="logout">{{logout}}</button></a>
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

//END COMPONENTS


var myRouter = new VueRouter({
    routes: [
        {
            path: '/lounge',
            component: function(resolve, reject){
                $.get('/html/lounge.html', function(htmlFromServer){
                    resolve({template: htmlFromServer});
                });
            }
        },
        {
            path:'/humidor',
            component: function(resolve, reject){
                $.get('/html/humidor.html', function(htmlFromServer){
                    resolve({template: htmlFromServer});
                });
            }
        }
    ]
});




// VUE APP
var mainVm = new Vue({el: '#lounge_app', router: myRouter});



}); //END DOCUMENT

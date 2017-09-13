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
              <a href="/logout"><button id="logout-btn" class="btn my-2 my-sm-0" type="logout">{{logout}}</button></a>
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

// SEARCH
Vue.component('cigar-search', {
    template: `
    <div class="row humidor-row">
        <div class="col-12 humidor-col-12">
            <div class="form-group row humidor-form">
                  <div class="col-12 humidor-search">
                    <input class="form-control" type="search" value="Search Cigars" id="search-input">
                 </div>
            </div>
        </div>
    </div>
    `
});

Vue.component('cigar-display', {
    template :`
    <div class="row humidor-deeprow">
    <div class="col-12 humidor-col-12">
        <div class="cigar-info">
            <h2>{{brand}} <span class="cigar-name">"{{name}}"</span> {{size}}"</h2>
            <h4>Strength: <span class="cigar-str">{{strength}}</span></h4>
            <div class="row">
                <div class="col">
                  <img :src='imgurl' alt='cigar_image' class="cigarImg center-block">
                  <img src="/imgs/ci_logo.png" alt='cigars international logo' class="ciImg">
                </div>
                <div class="col">
                  <p id="par">Gauge: <span class="color">{{gauge}}<span></p>
                  <p>Wrapper: <span class="color">{{wrapper}}<span></p>
                  <a :href='buyurl' target='_blank'><p>{{urlcopy}}</p></a>
                </div>
                <div class="col">
                    <i v-on:click id="addCigar" class="fa fa-plus-circle center-block" aria-hidden="true"></i>
                </div>
            </div>
        </div>
    </div>

</div>
    `,
    props: [
        'brand',
        'name',
        'size',
        'gauge',
        'strength',
        'wrapper',
        'imgurl',
        'buyurl',
        'urlcopy'
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
                    resolve({
                        template: htmlFromServer,
                        data: function(){
                            return {cigars: []};
                        },
                        created: function() {
                            var thatVm = this;
                            $.get('/cigars', function(data){
                                // console.log(data);
                                thatVm.cigars = data;
                                // console.log(this);
                                // console.log(this.cigars);
                            });
                        }
                    });
                });
            }
        }
    ]
});

// VUE APP
var mainVm = new Vue({
    el: '#lounge_app',
    router: myRouter,
    data: {
        cigars: {},
    },
    created: function() {
        window.location='#/lounge';
        $.get('/cigars', function(data){
            // console.log(data);
            this.cigars = data;
            // console.log(this.cigars);
        });
    }
});

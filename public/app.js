//VUE COMPONENTS

// NAVBAR
Vue.component('cigar-navbar', {
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
            </ul>
              <a href="/logout"><button id="logout-btn" class="btn my-2 my-sm-0" type="logout">{{logout}}</button></a>
          </div>
    </nav>
    `,
    props: ['nav1', 'nav2', 'logout']
});

// FOOTER
Vue.component('lounge-footer', {
    template: `
        <footer>
            <p class="text-center">{{footerCopy}}</p>
        </footer>
        `,
    props: ['footer-copy']
});

// LOUNGE USER INFO
Vue.component('userinfo-dash', {
    methods: {
        photoUp: function(event) {
            var formData = new FormData($('#photoUpload')[0]);
            var inputs = $('input');
            console.log(inputs[1]);

            $.ajax({
                url: '/profile-photo',
                data: formData,
                processData: false,
                contentType: false,
                type: 'POST',
                success: function(data) {
                    console.log(data);
                }
            });
        }
    },
    template: `
    <div class="row">
        <div class="col-8 lounge-col-8" id="userInfo">
            <h1 class='text-center'>Welcome to The Cigar Lounge, <span class="userName">{{user.username}}</span></h1>
            <div>
                <table class="table table-sm cigar-table">
                    <thead>
                        <tr>
                            <th>Unique Cigars</th>
                            <th>Total Cigars</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{{uniquecigars}}</td>
                            <td>{{cigars}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div class="col-4 locker-col">
            <img :src='user.imgpath' alt="User Photo" class="img-thumbnail center-block">
            <form id="photoUpload" v-on:submit="photoUp" enctype="form-data">
                <input type="file" id ="file" name="profile-pic"  class="inputfile">
                    <label for="file">Choose file</label>
                <button  class="btn d-inline" type="submit">Upload Photo</button>
            </form>
        </div>
    </div>
    `,
    props: ['user', 'cigars', 'uniquecigars']
});

//CIGAR LOCKER FEED
Vue.component('user-locker', {
    template: `
        <h1 class="lockerh1">{{user.username}}'s Cigar Locker</h1>
    `,
    props: ['user']
});

Vue.component('user-cigars', {

    template: `
            <div class="row userCigars">
                <div class="col">
                    <img :src='image'>
                </div>
                <div class="col">
                    <p><span class="lockerUser">{{user.username}} Enjoyed:</span><br> <span class="lockerBrand">{{brand}}'s <br> "{{name}}"</span></p>
                </div>
                <div class="col">
                    <i v-on:click="$emit('deleteCigar')" class="fa fa-trash-o"></i>
                </div>
            </div>
    `,
    props: ['user', 'brand', 'image', 'name']
});

// HUMIDOR SEARCH
Vue.component('cigar-display', {
    template: `
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
                  <p>Gauge: <span class="color">{{gauge}}</span></p>
                  <p>Wrapper: <span class="color">{{wrapper}}</span></p>
                  <p>Origin: <span class="color">{{origin}}</span></p>
                  <a :href='buyurl' target='_blank'><p>{{urlcopy}}</p></a>
                </div>
                <div class="col">
                    <i v-on:click="$emit('addcigar')" class="fa fa-plus-circle center-block" aria-hidden="true"></i>
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
        'origin',
        'wrapper',
        'imgurl',
        'buyurl',
        'urlcopy'
    ]
});

//END COMPONENTS

//ROUTERS
var myRouter = new VueRouter({
    routes: [
        {
            path: '/lounge',
            component: function(resolve, reject) {
                $.get('/html/lounge.html', function(htmlFromServer) {
                    resolve({
                        template: htmlFromServer,
                        data: function() {
                            return {
                                users: [],
                                cigarsEnjoyed: []
                            };
                        },
                        computed: {
                            uniqueCigars: function() {
                                var total = 0;
                                for (var key in this.users.cigars) {
                                    total++;
                                }
                                return total;
                            },
                            totalCigars: function() {
                                var total = 0;
                                for (var key in this.users.cigars) {
                                    total += this.users.cigars[key];
                                }
                                return total;
                            }
                        },
                        created: function() {
                            $.get('/me', (data) => {
                                // console.log(data);
                                this.users = data;
                            });
                        },
                        mounted: function() {
                            $.ajax({
                                url: '/cigars_enjoyed',
                                method: 'GET',
                                success: (data) => {
                                    // console.log(data);
                                    this.cigarsEnjoyed = data;
                                    console.log(this.cigarsEnjoyed);
                                }
                            });
                        },
                        methods: {
                            deleteCigar: function(cigar){
                                window.location="/dashboard";
                                console.log('cigarID');
                                
                            }
                        }
                    });
                });
            }
        }, {
            path: '/humidor',
            component: function(resolve, reject) {
                $.get('/html/humidor.html', function(htmlFromServer) {
                    resolve({
                        template: htmlFromServer,
                        data: function() {
                            return {cigars: [], cigFeed: {}, search: ''};
                        },
                        methods: {
                            addCigar: function(cigar, brand, name, img) {
                                window.location = '/dashboard';
                                // console.log('cigars!');
                                $.ajax({
                                    method: 'PUT',
                                    url: '/me',
                                    data: {
                                        cigar: cigar._id,
                                        brand: cigar.brand,
                                        name: cigar.name,
                                        img: cigar.image_url
                                    }
                                }).done((data) => {
                                    // console.log(data);
                                    cigFeed = data;
                                    console.log(cigFeed);
                                });
                            }
                        },
                        computed: {
                            filteredList: function() {
                                console.log(this);
                                return this.cigars.filter(cigar => {
                                    //   console.log(this.cigars);
                                    return (cigar.brand.toLowerCase().includes(this.search.toLowerCase()) || cigar.name.toLowerCase().includes(this.search.toLowerCase()) || cigar.strength.toLowerCase().includes(this.search.toLowerCase()) || cigar.wrapper.toLowerCase().includes(this.search.toLowerCase()) || cigar.origin.toLowerCase().includes(this.search.toLowerCase()));
                                });
                            }
                        },
                        created: function() {
                            var thatVm = this;
                            $.get('/cigars', function(data) {
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
        users: {}
    },
    created: function() {
        window.location = '#/lounge';
        $.get('/cigars', function(data) {
            // console.log(data);
            this.cigars = data;
            // console.log(this.cigars);
        });
        $.get('/me', function(data) {
            // console.log(data);
            this.users = data;
            // console.log(this.users);
        });
    },
    methods: {
        addCigar: function(event) {
            // console.log('cigars!')
            $.put('/me', {
                cigars: cigar._id
            }, function(data) {});
        }
    }
});

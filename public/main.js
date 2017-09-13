$(document).ready(function() {

    // VUE COMPONENTS
    Vue.component('landing-page', {
        data: () => {
            return {
            username: '',
            password: '',
            };
        },
        template: `
    <div class='row' id="main-block">
        <div class="col left-logo">
          <img src="/imgs/cigar_lounge_logo.png" alt='cigar lounge logo' id="mainlogo">
        </div>
        <div class="col">
          <!-- Toggle Header -->
          <div class="right-signup">
              <h3 id="signUpHead" class="current">{{signuphead}}</h3><h3 id="loginHead">{{loginhead}}</h3>
              <!-- <h3 v-on:click="log">asdfghjkl</h3>-->

                  <!-- Sign Up Form -->
                  <form id="signupForm">
                        <div class="form-group">
                            <label>{{userhead}}</label>
                            <input v-model="username" type="username" class="form-control" placeholder="Username" required>
                        </div>
                        <div class="form-group">
                            <label>{{passhead}}</label>
                            <input v-model="password" type="password" class="form-control" placeholder="Password" required>
                        </div>
                        <input v-on:click="signUp($event)" type="submit" class="btn btn-default">
                    </form>

                    <!-- Login Form -->
                    <form id="loginForm" hidden>
                        <div class="form-group">
                            <label>{{userhead}}</label>
                            <input v-model="username" type="username" class="form-control" placeholder="Username" required>
                        </div>
                        <div class="form-group">
                            <label>{{passhead}}</label>
                            <input v-model="password" type="password" class="form-control" placeholder="Password" required>
                        </div>
                        <button v-on:click="login($event)" type="submit" class="btn btn-default">Login</button>
                    </form>
            </div>
        </div>
    </div>
    `,
        props: ['signuphead', 'loginhead', 'userhead', 'passhead'],
        methods: {
            log: function() {console.log(this);
            },
            signUp: function(event){
                event.preventDefault();
                console.log(this.username, this.password);
                $.post('/signup', { username:this.username, password:this.password }, function(data){
                    console.log(data);
                    window.location="/dashboard";
                });
            },
            login: function(event){
                event.preventDefault();
                $.post('/login', { username:this.username, password:this.password }, function(data){
                    console.log(data);
                    window.location='/dashboard';
                });
        }
    },
    });

    // VUE APP
    var mainVm = new Vue({el: '#app'}); // END VUE APP

    // SIGN-UP | LOGIN TOGGLE
    $('#loginHead').on('click', function() {
        $('#signupForm').hide();
        $('#signUpHead').removeClass('current');
        $('#loginForm').removeAttr('hidden');
        $('#loginForm').show();
        $('#loginHead').addClass('current');
    });

    $('#signUpHead').on('click', function() {
        $('#loginForm').hide();
        $('#loginHead').removeClass('current');
        $('#signupForm').show();
        $('#signUpHead').addClass('current');
    });

}); // END OF JS DOCUMENT.READY()

$(document).ready(function(){

    Vue.component('landing-page', {
    template: `
    <div class='row' id="main-block">
        <div class="col left-logo">
          <img src="/imgs/cigar_lounge_logo.png" alt='cigar lounge logo' id="mainlogo">
        </div>
        <div class="col">
          <!-- Toggle Header -->
          <div class="right-signup">
              <h3 id="signUpHead">{{signup}}</h3><h3 id="loginHead">{{login}}</h3>

                  <!-- Sign Up Form -->
                  <form id="signupForm">
                        <div class="form-group">
                            <label>{{name}}</label>
                            <input type="name" class="form-control" placeholder="Name" required>
                        </div>
                        <div class="form-group">
                            <label>{{email}}</label>
                            <input type="email" class="form-control" placeholder="E-Mail" required>
                        </div>
                        <div class="form-group">
                            <label>{{password}}</label>
                            <input type="password" class="form-control" placeholder="Password" required>
                        </div>
                        <button type="submit" class="btn btn-default" id="signUp">{{signup}}</button>
                    </form>

                    <!-- Login Form -->
                    <form id="loginForm" hidden>
                        <div class="form-group">
                            <label>{{email}}</label>
                            <input type="email" class="form-control" placeholder="E-Mail" required>
                        </div>
                        <div class="form-group">
                            <label>{{password}}</label>
                            <input type="password" class="form-control" placeholder="Password" required>
                        </div>
                        <button type="login" class="btn btn-default">Login</button>
                </form>
            </div>
        </div>
    </div>
    `,
    props: ['signup',
    'login',
    'name',
    'email',
    'password',
    ]
});

var mainVm = new Vue({    el: '#app'
});

    // SIGN-UP | LOGIN TOGGLE
    $('#loginHead').on('click', function (){
        $('#signupForm').hide();
        $('#loginForm').removeAttr('hidden');
        $('#loginForm').show();
    });

    $('#signUpHead').on('click', function (){
        $('#loginForm').hide();
        $('#signupForm').show();
    });
    // END TOGGLE

});

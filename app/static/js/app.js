// let event = new Vue();

Vue.component('app-header', {
    template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
        <a id="photogram" class="navbar-brand" href="#">Photogram</a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav mr-auto">                
                <li class="nav-item active">
                    <router-link to="/" class="nav-link">Home</router-link>
                </li>
                <li class="nav-item">
                    <router-link to="/explore" class="nav-link">Explore</router-link>
                </li>
                <li class="nav-item">
                    <router-link to="/" class="nav-link">My Profile</router-link>
                </li>
                <li class="nav-item">
                    <router-link to="/logout" class="nav-link">Logout</router-link>
                </li>
            </ul>
        </div>
    </nav>
    `,

    data: function() {
        return {
            loggedIn: false,
            userPath: ""
        }
    },

      methods: {
        show: function(){
            this.loggedIn = !this.loggedIn;
        }
      },

        created (){
            let self = this;
            event.$on("loggedIn", function(id){
                self.show();
                self.userPath = "/users/" + id;
            });

            event.$on("loggedOut", function(){
                self.show();
            });
        }
});

Vue.component('app-footer', {
    template: `
    <footer>
        <div class="container-fluid">
            <p class="card-text">Copyright &copy; Flask Inc.</p>
        </div>
    </footer>
    `
});

const homePage = Vue.component('home', {
    template: `
    <div id="home">
        <div id="mainBox">
            <p id="photogramLabel">Photogram</p>
            <hr>
            <p>Share photos of your favourite moments with friends, famiy and the world.</p><br><br>
            <button id="login_button" type="submit" >Login</button>
            <button id="register_button" type="submit" v-on:click="register()">Register</button>
        </div>            
        <img src="/static/icons/Document.png" id="homeImage"></img>
    </div>
    `,

      data: function(){
            return{}
      }
});

const loginPage = Vue.component('login', {
    template: `
    <div>
        <h2>Login<h2>
        <div v-if = "visible">
            <div v-if = "errors" class = "alert alert danger">
                 <li v-for = "error in errors">{{error}}</li>
             </div>
             <div v-else class = "alert alert-success">
                <p>Logged in Successfully!.</p>
             </div>
        </div>
        <form method="POST" @submit.prevent="login" visible="true" id="loginForm">
            <div class="form-group">
                <label for="username">Username</label>
                <input name="username" id="username"></input>
            </div>
            <div class="form-group">
                <label for="password">Password</label>
                <input id="password" type="password"></input>
            </div>
            <button type="submit" name="submit" class="btn btn-primary btn-block">Log in</button>
        </form>
    </div>
    `,

    methods:{
        login: function(){
            let self = this;

            let loginForm = document.getElementsById('loginForm');
            let form_data = new FormData(loginForm);
            fetch("/api/auth/login",{
                method: 'POST',
                body: form_data,
                headers: {
                    'X-CSRFToken': token
                  },
                  credentials: 'same-origin'
                 })
                 .then(function(response){
                      return response.json();
                 })
                 .then(function(jsonResponse){
                //display a success message
                self.errors = jsonResponse.errors;
                if(jsonResponse.errors == null){
                    event.$emit("loggedIn", jsonResponse.id);
                }
                console.log(jsonResponse);
            })
            .catch(function(error){
                console.log(error);
            });
                    }

            },
    data:function(){
        return {
            errors:[],
            visible:false
        }
    }
    
});

const newPostPage = Vue.component('new_post', {
    template: `
    <div id="new_post">
        <h2>New Post<h2><br>
        <div id="newPostFormBox">
            <form id="newPostForm">
                <label>Photo</label>
                <input id="photo" type="file"></input><br><br>
                <label>Caption</label>
                <input id="caption" type="text" placeholder="Write a caption..."></input><br><br>
                <button id="newPostSubmitButton" type="submit" name="login">Submit</button>
            </form>
        </div>
    </div>
    `
});

const registerPage = Vue.component('/register', {
    template: `
    <div id="new_user">
        <h2>Register</h2>
        <div id="newUserFormBox">
            <form id="registerForm" method="POST" @submit.prevent="register" enctype="multipart/form-data" class="">
                <label for="username">Username</label><br>
                <input id="username" type="text" name="username"></input><br><br>
                <label for="password">Password</label><br>
                <input id="password" type="password" name="password"></input><br><br>
                <label for="first_name">First Name</label><br>
                <input id="first_name" type="text" name="first_name"></input><br><br>
                <label for="last_name">Last Name</label><br>
                <input id="last_name" type="text" name="last_name"></input><br><br>
                <label for="email">Email</label><br>
                <input id="email" type="email" name="email"></input><br><br>
                <label for="location">Location</label><br>
                <input id="location" type="text" name="location"></input><br><br>
                <label for="biography">Biography</label><br>
                <input id="biography" type="text" name="biography"></input><br><br>
                <label for="profile_photo">Photo</label><br>
                <input id="profile_photo" type="file" name="photo"></input><br><br>
                <button id=registerButton type="submit"></button>
            </form>
        </div>
    </div>
    `,
    methods: {
        register: function(){
            let self = this;
            let registerForm = document.getElementById('registerForm');
            let form_data = new FormData(registerForm);

            self.message = "";
            self.errors = [];
            fetch("/api/register", {
                method: 'POST',
                body : form_data,
                headers: {
                    'X-CSRFToken': token
                },
                credentials: 'same-origin'
            })
                .then(function (response) {
                    return response.json();
                })
                .then(function (jsonResponse) {
                    // display a success message
                    if (jsonResponse.errors) {
                        self.errors = jsonResponse.errors;
                    } else {
                        self.message = jsonResponse.message;
                    }
                    console.log(jsonResponse);
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    },
});

const newUserPage = Vue.component('new_user', {
    template: `
    <div id="new_user">
        <h2>Register</h2>
        <div id="newUserFormBox">
            <form>
                <label>Username</label><br>
                <input id="username" type="text" name="username"></input><br><br>
                <label>Password</label><br>
                <input id="password" type="password" name="password"></input><br><br>
                <label>First Name</label><br>
                <input id="first_name" type="text" name="first_name"></input><br><br>
                <label>Last Name</label><br>
                <input id="last_name" type="text" name="last_name"></input><br><br>
                <label>Email</label><br>
                <input id="email" type="email" name="email"></input><br><br>
                <label>Location</label><br>
                <input id="location" type="text" name="location"></input><br><br>
                <label>Biography</label><br>
                <input id="biography" type="text" name="biography"></input><br><br>
                <label>Photo</label><br>
                <input id="profile_photo" type="file" name="photo"></input><br><br>
                <button id=registerButton type="submit"></button>
            </form>
        </div>
    </div>
    `
});

const explorePage = Vue.component('explore', {
    template: `
    <div id="explore">
        <div ="rightButtonDiv>
            <button id="new_postButton" type="button">New Post</button>
        </div>
        <div id="exploreMainBox">
            <p id="user_name"><img id="profilePic"></img></p>
            <img id="imagePosted"></img>< br>
            <p id="imageCaption"></p><br><br>
            <p id="datePosted"></p>
            <p id="likes"><img id="likeIcon" src="heart-icon.png"></img></p>
        </div>        
    </div>
    `,

    data: function(){
        return {
            posts:[]
        }
    },

    methods:{
        addEvents: function(){
            let posts = document.getElementsByClassName("like");
            let eventAdded = true;
            let clicked = false;

            for (i=0; i<posts.length; i++){
                let id = (posts[i].getAttribute("id"));
                let likes = parseInt(posts[i].lastChild.textContent.slice(0, -6));

                if (posts[i].getAttribute("event-added")== "false"){
                    posts[i].addEventListener("click", function(e){
                        likes++;
                        clicked = true;

                        fetch("/api/posts" + id + "/like",{
                            method: 'POST',
                            headers: {
                                'X-CSRFToken': token,
                                'Authorization': 'Bearer' + localStorage.getItem('token')
                            },

                             credentials: 'same-origin'
                        })
                        .then(function (response){
                            return response.json();
                        })
                        .then(function (jsonResponse){
                            //display a success message
                            self.errors = jsonResponse.errors;
                            console.log(jsonResponse);
                        })
                        .catch(function(error){
                            console.log(error);
                        });
                        this.setSAttribute("clicked", clicked);
                        if(this.getAttribute("clicked")=="true"){
                            this.setAttribute("disabled", "true");
                            this.innerHTML = '<span data-toggle = "modal" data-target = "#likeModal"><span class = "likeIcon"><i class = "heart-icon"></i></span>' + likes + 'Likes</span>';
                        }
                        console.log(likes);
                    });
                    posts[i].setAttribute("event-added", eventAdded);
                }
            }
        }

    },

    created: function(){
        let self = this;
        let post = '';
        let likeBtn = '';
        let likeIcon = '';
        fetch("/api/posts/",{
            method: 'Get',
            headers: {
                'X-CSRFToken': token,
                'Authorization': 'Bearer' + localStorage.getItem('token')
            },
            credentials: 'same-origin'
        })
        .then(function (response){
            return response.json();
        })
        .then(function(jsonResponse){
            //display a success message
            console.log(jsonResponse);

            let p = jsonResponse.posts;
            for(i = 0; i<p.length; i++){
                if(p[i].likes_by_current_user == false){
                    likeBtn = '<button event-added = "false" clicked = "false" class = "like-btn font-weight-bold" id ="';
                    likeIcon = '"><span><span class = "likeIcon"><i class = "heart-icon"></i></span>';
                }else{
                    likeBtn = '<button data-toggle = "tooltip" title = "You already liked this post" data-placement = "top" disabled = "true" class = "like like-btn font-weight-bold" id = "';
                    likeIcon = '"><span data-toggle = "modal" data-target = "#likeModal"><span class = "likeIcon"><i class = "heart-icon"></i></span>';
                }
                   post += '<div class="form, post"><div class="post-header"><a href="#/users/' + p[i].user_id + 
                           '"><img src="static/uploads/' + p[i].profile_pic + '"/><span>' + p[i].Post_creator + '</span></a>' +
                           '</div><div class="posted-img text-center"><img src="static/uploads/' + p[i].pic + '"/></div>' +
                           '<div class="caption">' + p[i].caption + '</div><div class="post-footer">' + likeBtn + p[i].id + likeIcon + p[i].likes +
                           ' Likes</span></button><span class="float-right">' + p[i].created_on + '</span></div></div>';
                    self.posts.push(post);
                    post = '';


                }
                self.posts.reverse();

            })
            .catch(function (error){
                console.log(error);
            });


        }
    
});

const NotFound = Vue.component('not-found', {
    template: `
    <div>
        <h1>404 - Not Found</h1>
    </div>
    `,
    data: function () {
        return {}
    }
})

const router = new VueRouter({
    mode: 'history',
    routes: [
        { path: "/", component: homePage },
        { path: "/register", component: registerPage },
        { path: "/login", component: loginPage },
        // { path: "/logout", component: logoutPage },
        { path: "/explore", component: explorePage },
        // { path: "/users/:user_id", component: profilePage },
        // { path: "/posts/new", component: new_post_page },

        // { path: "/new_user", component: newUserPage },
        // { path: "/new_post", component: newPostPage },
        
        { path: "*", component: NotFound },
    ]
});

let app = new Vue({
    el: "#app",
    router
});
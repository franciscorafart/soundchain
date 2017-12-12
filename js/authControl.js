//listener for authentication change. If user is logged in, run the app if not redirect to index.html
firebase.auth().onAuthStateChanged((user)=>{
    if (user) {
      // User is signed in.
      var displayName = user.displayName;
      var email = user.email;
      var emailVerified = user.emailVerified;
      var photoURL = user.photoURL;
      var uid = user.uid;
      var phoneNumber = user.phoneNumber;
      var providerData = user.providerData;
      user.getIdToken().then((accessToken)=>{
        document.getElementById('sign-in-status').textContent = 'Signed in';
        document.getElementById('sign-in').textContent = 'Sign out';
        document.getElementById('account-details').textContent = JSON.stringify({
          displayName: displayName,
          email: email,
          emailVerified: emailVerified,
          phoneNumber: phoneNumber,
          photoURL: photoURL,
          uid: uid,
          accessToken: accessToken,
          providerData: providerData
        }, null, '  ');
      });

      console.log("User "+displayName+" logged in");

      //run app if user is logged in
      runApp(user);
    } else {
      //Redirect to login if user not logged in
      window.location.replace("index.html")
      // User is signed out.
      document.getElementById('sign-in-status').textContent = 'Signed out';
      document.getElementById('sign-in').textContent = 'Sign in';
      document.getElementById('account-details').textContent = 'null';
    }
  }, (error)=>{
    console.log(error);
  });

  function runApp(appUser){
    //Signout button
    $('#sign-in').on('click',()=>{
      firebase.auth().signOut().then(function() {
    // Sign-out successful.
      console.log("Logged out")

      }, function(error) {
    // An error happened.
      console.log(error)
      });
    })
  }

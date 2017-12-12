//listener for authentication change. If user is logged in, run the app if not redirect to index.html
firebase.auth().onAuthStateChanged((user)=>{
    if (user) {
      // User is signed in.
      let displayName = user.displayName;
      let email = user.email;
      let emailVerified = user.emailVerified;
      let photoURL = user.photoURL;
      let uid = user.uid;
      let phoneNumber = user.phoneNumber;
      let providerData = user.providerData;
      user.getIdToken().then((accessToken)=> {
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
      runApp(user)

    } else {
      //redirect to login
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
    let database = firebase.database()
    let storage = firebase.storage()
    let storageRef;
    let uploadFile
    let songData = database.ref("Songs/")
    let userData = database.ref("User/")


    //Set up profile information
    $('#userName').text("Name: "+appUser.displayName)
    $('#userEmail').text("Email: "+appUser.email)
    if(appUser.photoURL!=null){
      $('#profileImage').attr('src',appUser.photoURL)
    }

    //Displaying current money in the DOM
    pushCash(0)

    songData.on('value',(snapshot)=>{
      //first remove elements from ul
      $('.listElement').remove()
      snapshot.forEach((artistSnap)=>{
        artistSnap.forEach((artistTrack)=>{
          let songObj = artistTrack.val()
          if (songObj.owner == appUser.uid){ //if user is the owner of track
            //append into users songs
            let listImg = "<img class='trashCan' src='images/trash.png' alt='trash'>"
            let $listElement = "<li class='listElement clearfix'>"+"<span>"+songObj.title+"</span>"+"<span>"+songObj.id+"</span>"+listImg+"</li>"
            $('#userSongs').append($listElement)

          }
        })
      })

      //add listener to trash can
      $('.trashCan').on('click',function(){

        //TODO: Ask for confirmation to delete

        //We take from DOM information of track that the user wants to delete
        // console.log(e.target.parentNode.childNodes[0]) //works with anonymous function
        let songTitle = this.parentNode.childNodes[0].innerHTML //this. has to use function(), not ()=>
        let songId = this.parentNode.childNodes[1].innerHTML

          //Delete from storage, database and DOM. The listen history remains in the users reference
          //delete from database and storage
          snapshot.forEach((artistSnap)=>{
            console.log(artistSnap.key)
            artistSnap.forEach((artistTrack)=>{
              let songObj = artistTrack.val()

              if ((songObj.id == songId) &&(songObj.title == songTitle)){
                console.log(artistTrack.key)

                //delete from database
                songData.child(artistSnap.key).child(artistTrack.key).remove()

                //delete from storage with url?
                //TODO: Delete from storage

                // Create a reference to the file to delete
                let desertRef = storage.ref(songObj.title+".mp3");

                // Delete the file
                desertRef.delete().then(function() {
                  alert('File deleted successfuly')
                }).catch(function(error) {
                  console.log(error)
                });
              }
            })
          })
      })

    })

    //File manager. To upload tracks into Firebase Storage

    document.getElementById('myFile').addEventListener('change',(e)=>{
      //Get a file
      let $progress = document.getElementById('progress')
      console.log(e)
      uploadFile = e.target.files[0]
      //Empty string
      $progress.innerHTML = ""
    })

    //Upload song into data storage
    $("#push").on('click',(e)=>{
      //TODO:Control for empty strings

      //get information from inputs
      let songTitle = $("#songName").val();
      let id = $("#ID").val();
      let author = $("#author").val();//artist name
      let url
      let $uploader = document.getElementById('uploader')
      let $progress = document.getElementById('progress')

      //Create storage reference
      //TODO: Create storage reference by artist for easier query later
      storageRef = storage.ref(songTitle+'.mp3')
      //to store in folder with user's tracks
      // storageRef = storage.ref(appUser.uid+"/"+songTitle+'.mp3')

      //TODO: Create file reference inside function, not with global variable.

      //Upload file and assign it to task var, so we can pass information from it
      var task = storageRef.put(uploadFile)

      //Update progress bar
      task.on(
        'state_changed',
        function progress(snapshot){
        let percentage = (snapshot.bytesTransferred/snapshot.totalBytes)*100;
        $uploader.value = percentage
        $progress.innerHTML = "Uploading..."+Math.floor(percentage)+"%"
      }, function error(err){
        console.log(err)
      }, function complete(c){
        $progress.innerHTML = 'Upload Complete!'
      }
    )
    //When upload is finished, we create a song reference in the database that includes the storage url
    task.then((snapshot)=>{
      console.log(snapshot)
      //when upload is complete
      //get url
      url = snapshot.downloadURL
      // push to database
      pushSong(songTitle, id, author, url);
    })

      //Clear inputs. Does't work
      $("#songName").text = "";
      $("#ID").text = "";
      $("#author").text = "";
    });

    //Button to add money
    $("#pushCash").on('click', function(){
      let cashPushed = $('#addCash').val()
      //clear value
      //TODO: Create real mechanism of payment

      //push amount
      pushCash(cashPushed)
    })

    function pushSong(title,id,author,url){
      songData.child(author).push({
        title: title,
        id: id,
        owner: appUser.uid,
        url: url,
        votes: 0
      });
    }

    function pushCash(x){
      //reference to users wallet
      let moneyRef = userData.child(appUser.uid).child('Wallet')
      let moneyNow =0;

      //Function to calculate how much money the user has
      moneyRef.once('value',(child)=>{
        if(child.val()){//if different than null
          if (x>0){
            moneyRef.push({money: x})
            moneyNow = parseInt(x); // money now starts  as what we're adding
          }
        } else{ //if null we create a wallet
          moneyRef.push({money: 0})
        }
        //add money
        console.log(child.val())

        //Add up and reassign display money
        child.forEach((thisMoney)=>{
          console.log(thisMoney.val().money)
          moneyNow += parseInt(thisMoney.val().money)
        })
        $("#yourMoney").text("Your money $ "+moneyNow)
      })

    }

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

  //End back end

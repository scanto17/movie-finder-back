'use strict';

module.exports = function(Appuser) {
    Appuser.afterRemote('login', async (ctx, user, next) => {
        if (user) {
            user.token = user.id;
        }
        let userData = await Appuser.find({
            fields:{password: false, username: false, realm: false, '_id': 0},
            include:{
              relation: 'favorites',
              scope: {
                fields: ['movieTitle', 'thirdPartyMovieId', 'movieGenre', 'overview', 'id']
              },
            },
            where: {
              id: user.userId
            }
          })
          console.log()
          user.userData = userData[0]
    })
    
    Appuser.observe('after save', function(ctx, next) {
        if (ctx.isNewInstance === true) {
        var instance = ctx.instance;
        instance.createAccessToken(1209600000, 
            function(err, response){
            if (err === null) {
                ctx.instance['userId'] = response.userId
                ctx.instance["token"] = response.id;
            }
                next();
            });
            }
            else {
                next();
            }
    });
}

// delete this, should be in user service
//registerUser(){
//     _http.post("backendurl", newUser).subscribe( res => {
//         sessionStorage.setItem('token', res.token);
//         sessionStorage.setItem('userId', res.userId);
//     })
// }

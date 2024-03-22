var userID = null;

AFRAME.registerComponent("markerhandler", {
    init: async function() {

      if(userID == null){
        this.askUserId()
      }

      var toys = await this.getToys();
  
      this.el.addEventListener("markerFound", () => {
        var markerId = this.el.id;
        this.handleMarkerFound(toys, markerId);
      });
  
      this.el.addEventListener("markerLost", () => {
        this.handleMarkerLost();
      });
    },
    askUserId: function(){
      var iconUrl = "icon.png";
      swal({
        title:"Welcome To The Toy Store!!",
        icon:iconUrl,
        content:{
          element:"input",
          attribute:{
            placeholder:"Type your uid Ex:U01",
            type:"number",
            min:1,
          }
        },
        closeOnClickOutside:false,
      }).then(inputValue => {
        tableNumber = inputValue;
      });
    },
    handleMarkerFound: function(toys, markerId) {
      var order = toys.filter(order => order.id === markerId)[0];

      if(order.is_out_of_stock == True){
        swal({
          icon: "warning",
          title: dish.dish_name.toUpperCase(),
          text: "The toy is out of stock!!!",
          timer: 2500,
          buttons: false
      });
      }
      else{
        var model = document.querySelector(`#model-${toy.id}`);
        model.setAttribute("position", toy.model_geometry.position);
        model.setAttribute("rotation", toy.model_geometry.rotation);
        model.setAttribute("scale", toy.model_geometry.scale);

        model.setAttribute("visible", true);

        var mainPlane = document.querySelector(`#main-plane-${toy.id}`);
        mainPlane.setAttribute("visible", true);

        var titlePlane = document.querySelector(`#title-plane-${toy.id}`);
        titlePlane.setAttribute("visible", true);

        var toyTitle = document.querySelector(`#toy-title-${toy.id}`);
        toyTitle.setAttribute("visible", true);

        var description = document.querySelector(`#description-${toy.id}`);
        description.setAttribute("visible", true);

        var age = document.querySelector(`#age-${toy.id}`);
        age.setAttribute("visible", true);

        var pricePlane = document.querySelector(`#price-plane-${toy.id}`);
        pricePlane.setAttribute("visible", true);

        var buttonDiv = document.getElementById("button-div");
      buttonDiv.style.display = "flex";
  
      var orderButtton = document.getElementById("order-button");
      var orderSummaryButtton = document.getElementById("order-summary-button");

      if(userID != null){
        orderSummaryButtton.addEventListener("click", () => {
          swal({
            icon: "warning",
            title: "Order Summary",
            text: "Work In Progress"
          });
        });
        orderButtton.addEventListener("click", () => {
          var UID;
          userID <= 9 ? (UID = `U0${userID}`) : `U${userID}`;
          this.handleOrder(UID, order);

          swal({
            icon: "https://i.imgur.com/4NZ6uLY.jpg",
            title: "Thanks For Order !",
            text: "",
            timer: 2000,
            buttons: false
          });
        });
       }  
      }
    },
    handleOrder: function(UID, order){
      firebase
        .firestore()
        .collection("users")
        .doc(UID)
        .get()
        .then(doc => {
          var details = doc.data();

          if(details["current_orders"][order.id]){
            details["current_orders"][order.id]["quantity"] += 1;

            var currentQuantity = details["current_order"][order.id]["quantity"];

            details["current_orders"][order.id]["subtotal"] = currentQuantity * order.price;
          }
          else{
            details["current_order"][order.id] = {
              item:order.toy_name,
              price:order.price,
              quantity:1,
              subtotal: toy.price * 1,
            };
          };

          details.total_bill += order.price;
          firebase
            .firestore()
            .collection("users")
            .doc(doc.id)
            .update(details)
        });
    },
    getToys: async function() {
      return await firebase
        .firestore()
        .collection("toys")
        .get()
        .then(snap => {
          return snap.docs.map(doc => doc.data());
        });
    },
    handleRatings:function(){
      document.getElementById("rating-modal-div").style.display = "flex";
      document.getElementById("rating-input"),value = "0"

      var saveRatingButton = document.getElementById("save-rating-button");
      saveRatingButton.addEventListener("click", () => {
        document.getElementById("rating-button-div").style.display = "none";
        var rating = document.getElementById("rating-input").value;

        firebase
          .firestore()
          .collection()
          .doc(toy.id)
          .update({
            rating:rating
          })
          .then(() => {
            swal({
              icon:"success",
              title:"Thanks for Rating",
              text: "We Hope You Liked the Toy!!",
              timer:2500,
              buttons:false,
            });
          });
      });
    },
    handleMarkerLost: function() {
      var buttonDiv = document.getElementById("button-div");
      buttonDiv.style.display = "none";
    }
  });
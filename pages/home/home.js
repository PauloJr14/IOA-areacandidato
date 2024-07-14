document.addEventListener('DOMContentLoaded', (event) => {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            var collection = firebase.firestore().collection("dados");

            // Consulta para contar os documentos onde "inscrito-historia2024" é igual a "Sim"
            collection.where("inscrito-historia2024", "==", "Sim").get().then((querySnapshot) => {
                var local = document.getElementById("total");
                local.textContent = querySnapshot.size
                var local2 = document.getElementById("ttotal");
                local2.textContent = querySnapshot.size + 442

            }).catch((error) => {
                console.error("Erro ao consultar documentos:", error);
            });

            collection.where("inscrito-historia2024", "==", "Sim").where("level", "==", "nível 1").get().then((querySnapshot) => {
                var local = document.getElementById("n1");
                local.textContent = querySnapshot.size; // Número de documentos na consulta
                var local2 = document.getElementById("tn1");
                local2.textContent = querySnapshot.size + 80

            }).catch((error) => {
                console.error("Erro ao consultar documentos:", error);
            });

            collection.where("inscrito-historia2024", "==", "Sim").where("level", "==", "nível 2").get().then((querySnapshot) => {
                var local = document.getElementById("n2");
                local.textContent = querySnapshot.size
                var local2 = document.getElementById("tn2");
                local2.textContent = querySnapshot.size + 134

                // Pode adicionar código adicional aqui para usar a contagem como necessário
            }).catch((error) => {
                console.error("Erro ao consultar documentos:", error);
            });

            collection.where("inscrito-historia2024", "==", "Sim").where("level", "==", "nível 3").get().then((querySnapshot) => {
                var local = document.getElementById("n3");
                local.textContent = querySnapshot.size
                var local2 = document.getElementById("tn3");
                local2.textContent = querySnapshot.size + 228

                // Pode adicionar código adicional aqui para usar a contagem como necessário
            }).catch((error) => {
                console.error("Erro ao consultar documentos:", error);
            });

            collection.where("inscrito-historia2024", "==", "Sim").where("level", "==", "nível 4").get().then((querySnapshot) => {
                var local = document.getElementById("n4");
                local.textContent = querySnapshot.size
                var local2 = document.getElementById("tn4");
                local2.textContent = querySnapshot.size

                // Pode adicionar código adicional aqui para usar a contagem como necessário
            }).catch((error) => {
                console.error("Erro ao consultar documentos:", error);
            });

            collection.doc(user.uid).get().then((doc) => {
                if (doc.exists) {
                    if (doc.data().hasOwnProperty("inscrito-historia2024")) {
                        var inscritoValor = doc.data()["inscrito-historia2024"];
                        if (inscritoValor == "Sim") {
                            var h2 = document.getElementById("inscrito");
                            var button = document.getElementById("inscrever");

                            h2.style.display = "block";
                            button.style.display = "none";
                        } else if (inscritoValor == "admin") {
                            var button1 = document.getElementById("admin");
                            var button2 = document.getElementById("inscrever");

                            button1.style.display = "block";
                            button2.style.display = "none";
                        } else {
                            console.log('O campo "inscrito-historia2024" não é igual a "Sim" ou "admin"');
                        }
                    } else {
                        console.log('Campo "inscrito-historia2024" não encontrado no documento');
                    }
                } else {
                    console.log("Documento não encontrado");
                }
            }).catch((error) => {
                console.error("Erro ao consultar documento:", error);
            });
        } else {
            console.log("Nenhum usuário conectado");
        }
    });
});

function logout() {
    firebase.auth().signOut().then(() => {
        window.location.href = "../../index.html";
    }).catch(() => {
        alert('Erro ao fazer logout');
    })
}

function subscribe() {
    var div = document.getElementById("olimpiadas");
    var form = document.getElementById("olympiadForm");

    div.style.display = "none";
    form.style.display = "block";
}

function admin() {
    var div1 = document.getElementById("olimpiadas");
    var div2 = document.getElementById("nav-admin");

    div1.style.display = "none";
    div2.style.display = "block";
}

function comeback() {
    var div1 = document.getElementById("olimpiadas");
    var div2 = document.getElementById("nav-admin");
    var form = document.getElementById("olympiadForm");

    div1.style.display = "flex";
    div2.style.display = "none";
    form.style.display = "none";
}

function subcomplited() {
    var user = firebase.auth().currentUser;
	if (user) {
        console.log(user)
		var collection = firebase.firestore().collection("dados");
		var data = {
			"fullName": document.getElementById("fullName").value,
    		"dob": document.getElementById("dob").value,
			"city": document.getElementById("city").value,
	    	"state": document.getElementById("state").value,
			"country": document.getElementById("country").value,
    		"institution": document.getElementById("institution").value,
			"institutionType": document.getElementById("institutionType").value,
	    	"grade": document.getElementById("grade").value,
			"level": document.getElementById("level").value,
            "email": user.email,
            "inscrito-historia2024": "Sim"
    	}
		
        collection.doc(user.uid).set(data, {merge: true}).then(() => {
            comeback()
            var h2 = document.getElementById("inscrito");
            var button = document.getElementById("inscrever");

            h2.style.display = "flex";
            button.style.display = "none";
            alert("Sua incrição foi concluída com sucesso");
        }).catch((error) => {
            alert("Erro em realizar a inscrição: ", error);
        }); 
    } else {
        alert("Nenhum usuário está conectado");
    }
}

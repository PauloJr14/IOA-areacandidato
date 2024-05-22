document.addEventListener('DOMContentLoaded', (event) => {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            // Obtém a referência à coleção "inscrito-olimpiadahistoria"
            var collection = firebase.firestore().collection("dados");

            // Obtém o documento do usuário atual
            collection.doc(user.uid).get().then((doc) => {
                if (doc.exists) {
                    // Verifica se o campo "olimpiada-historia" existe no documento
                    if (doc.data().hasOwnProperty("inscrito-historia2024")) {
                        // Se o campo existir, atualiza a interface do usuário
                        var h2 = document.getElementById("inscrito");
                        var button = document.getElementById("inscrever");

                        h2.style.display = "block";  // Corrigido de "box" para "block"
                        button.style.display = "none";
                    } else {
                        console.log('Campo "olimpiada-historia" não encontrado no documento');
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

function comeback() {
    var div = document.getElementById("olimpiadas");
    var form = document.getElementById("olympiadForm");

    div.style.display = "flex";
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

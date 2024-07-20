document.addEventListener('DOMContentLoaded', (event) => {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            var collection = firebase.firestore().collection("dados");

            collection.doc(user.uid).get().then((doc) => {
                if (doc.exists) {
                    if (doc.data().hasOwnProperty("inscrito-historia2024")) {
                        var inscritoValor = doc.data()["inscrito-historia2024"];
                        if (inscritoValor == "Sim") {
                            var button1 = document.getElementById("aluno");
                            var button2 = document.getElementById("inscrever");

                            button1.style.display = "block";
                            button2.style.display = "none";
                        } else if (inscritoValor == "admin") {
                            var button1 = document.getElementById("admin");
                            var button2 = document.getElementById("inscrever");

                            button1.style.display = "block";
                            button2.style.display = "none";
                        } else if (inscritoValor == "prof") {
                            var button1 = document.getElementById("prof");
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

function prof() {
    var div1 = document.getElementById("olimpiadas");
    var div2 = document.getElementById("nav-prof");

    div1.style.display = "none";
    div2.style.display = "block";
}

function aluno() {
    var div1 = document.getElementById("olimpiadas");
    var div2 = document.getElementById("nav-aluno");

    div1.style.display = "none";
    div2.style.display = "block";
}

function admin() {
    var div1 = document.getElementById("olimpiadas");
    var div2 = document.getElementById("nav-admin");

    div1.style.display = "none";
    div2.style.display = "block";

    var collection = firebase.firestore().collection("dados");

    collection.get().then((querySnapshot) => {
        var totalSim = 0;
        var nivel1Count = 0;
        var nivel2Count = 0;
        var nivel3Count = 0;
        var nivel4Count = 0;

        querySnapshot.forEach((doc) => {
            var data = doc.data();
            if (data["inscrito-historia2024"] === "Sim") {
                totalSim++;
                switch (data["level"]) {
                    case "nível 1":
                        nivel1Count++;
                        break;
                    case "nível 2":
                        nivel2Count++;
                        break;
                    case "nível 3":
                        nivel3Count++;
                        break;
                    case "nível 4":
                        nivel4Count++;
                        break;
                }
            }
        });

        document.getElementById("total").textContent = totalSim;
        document.getElementById("ttotal").textContent = totalSim + 442;

        document.getElementById("n1").textContent = nivel1Count;
        document.getElementById("tn1").textContent = nivel1Count + 80;

        document.getElementById("n2").textContent = nivel2Count;
        document.getElementById("tn2").textContent = nivel2Count + 134;

        document.getElementById("n3").textContent = nivel3Count;
        document.getElementById("tn3").textContent = nivel3Count + 228;

        document.getElementById("n4").textContent = nivel4Count;
        document.getElementById("tn4").textContent = nivel4Count;
    }).catch((error) => {
        console.error("Erro ao consultar documentos:", error);
    });
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

document.getElementById("copyEmailsButton").addEventListener("click", async () => {
    try {
        // Referência à coleção de dados
        const collection = firebase.firestore().collection('dados');

        // Consulta para documentos onde "inscrito-historia2024" é igual a "Sim"
        const querySnapshot = await collection.where('inscrito-historia2024', '==', 'Sim').get();

        // Lista para armazenar os e-mails
        const emails = [];

        // Itera pelos documentos retornados pela consulta
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            if (data.email) {
                emails.push(data.email);
            }
        });

        // Converte a lista de e-mails em uma string separada por vírgulas
        const emailString = emails.join(', ');

        if (emailString) {
            // Cria um elemento de textarea para copiar o texto
            const textarea = document.createElement('textarea');
            textarea.value = emailString;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);

            alert("E-mails copiados para a área de transferência!");
        } else {
            alert("Nenhum e-mail encontrado.");
        }
    } catch (error) {
        console.error("Erro ao recuperar e copiar os e-mails:", error);
    }
});
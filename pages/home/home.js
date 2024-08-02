document.addEventListener('DOMContentLoaded', (event) => {
    document.querySelectorAll('textarea').forEach(textarea => {
        textarea.addEventListener('input', () => ajustarAlturaTextarea(textarea));
        ajustarAlturaTextarea(textarea); // Ajusta a altura inicial para o conteúdo pré-preenchido
    });

    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            var collection = firebase.firestore().collection("dados");

            collection.doc(user.uid).get().then((doc) => {
                if (doc.exists) {
                    if (doc.data().hasOwnProperty("inscrito-historia2024")) {
                        var inscritoValor = doc.data()["inscrito-historia2024"];
                        if (inscritoValor == "Sim") {
                            aluno(user);
                            var button1 = document.getElementById("aluno");
                            var button2 = document.getElementById("inscrever");

                            button1.style.display = "block";
                            button2.style.display = "none";
                        } else if (inscritoValor == "Não") {
                            subscribe()
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

function navaluno() {
    var div1 = document.getElementById("olimpiadas");
    var div2 = document.getElementById("nav-aluno");

    div1.style.display = "none";
    div2.style.display = "block";
}

function gabarito() {
    var div1 = document.getElementById("nav-aluno");
    var div2 = document.getElementById("gabarito");

    div1.style.display = "none";
    div2.style.display = "block";
    
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            var collection = firebase.firestore().collection("respostas-historia2024");
            var userDoc = collection.doc(user.uid);

            userDoc.get().then((doc) => {
                if (doc.exists) {
                    var data = doc.data();
                    
                    // Preencher respostas objetivas
                    if (data.respostas && data.respostas.objetivas) {
                        var respostasObjetivas = data.respostas.objetivas;
                        for (let key in respostasObjetivas) {
                            if (respostasObjetivas.hasOwnProperty(key)) {
                                let radio = document.querySelector(`input[name="${key}"][value="${respostasObjetivas[key]}"]`);
                                if (radio) {
                                    radio.checked = true;
                                }
                            }
                        }
                    }

                    // Preencher respostas abertas
                    if (data.respostas && data.respostas.dissertativas) {
                        var respostasDissertativas = data.respostas.dissertativas;
                        for (let key in respostasDissertativas) {
                            if (respostasDissertativas.hasOwnProperty(key)) {
                                let textarea = document.getElementById(key);
                                if (textarea) {
                                    textarea.value = respostasDissertativas[key];
                                    ajustarAlturaTextarea(textarea); // Ajusta a altura inicial para o conteúdo pré-preenchido
                                }
                            }
                        }
                    }
                }
            }).catch((error) => {
                console.error("Erro ao carregar respostas:", error);
            });
        } else {
            console.log("Nenhum usuário conectado");
        }
    });
}

function aluno(user) {
    var collection = firebase.firestore().collection("dados");

    collection.doc(user.uid).get().then((doc) => {
        var inscritoValor = doc.data() ? doc.data()["level"] : null; // Verifica se data existe
        if (inscritoValor) {
            var button = document.getElementById(`prova${inscritoValor.charAt(inscritoValor.length - 1)}`);

            if (button) {
                button.style.display = "block";
            } else {
                console.error(`Botão para ${inscritoValor} não encontrado.`);
            }
        } else {
            console.error("Valor de 'level' não encontrado no documento.");
        }
    }).catch((error) => {
        console.error("Erro ao acessar o Firestore:", error);
    });
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
    var div3 = document.getElementById("nav-prof");
    var div4 = document.getElementById("nav-aluno");
    var div5 = document.getElementById("gabarito");
    var form = document.getElementById("olympiadForm");

    div1.style.display = "flex";
    div2.style.display = "none";
    form.style.display = "none";
    div3.style.display = "none";
    div4.style.display = "none";
    div5.style.display = "none";
}

function comeback2() {
    var div1 = document.getElementById("nav-aluno");
    var div2 = document.getElementById("gabarito");

    div1.style.display = "block";
    div2.style.display = "none";
}

function correcao() {
    var div1 = document.getElementById("nav-admin");
    var div2 = document.getElementById("nav-corretor");

    div1.style.display = "none";
    div2.style.display = "block";

    seracorrigido(0)
}

function comeback3() {
    var div1 = document.getElementById("nav-admin");
    var div2 = document.getElementById("nav-corretor");

    div1.style.display = "block";
    div2.style.display = "none";
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

function rascunho() {
    var user = firebase.auth().currentUser;
    if (user) {
        var collection = firebase.firestore().collection("respostas-historia2024");
        var userDoc = collection.doc(user.uid);

        userDoc.get().then((doc) => {
            if (doc.exists) {
                // Se o documento existe, verifica se o campo "state" está presente
                if (doc.data().hasOwnProperty("state")) {
                    alert("Você já entregou as questões objetivas");
                } else {
                    // Se o campo "state" não existe, atualiza o rascunho
                    saveDraft(userDoc);
                }
            } else {
                // Se o documento não existe, cria um novo e salva o rascunho
                saveDraft(userDoc);
            }
        }).catch((error) => {
            console.error("Erro ao acessar o documento:", error);
        });
    } else {
        alert("Nenhum usuário está conectado");
    }
}

function entregar() {
    var user = firebase.auth().currentUser;
    if (user) {
        var collection = firebase.firestore().collection("respostas-historia2024");
        var userDoc = collection.doc(user.uid);

        // Obtém as respostas das questões objetivas
        var respostasObjetivas = {};
        for (var i = 1; i <= 20; i++) { // Supondo que tenha 20 questões objetivas
            var respostaSelecionada = document.querySelector(`input[name="q${i}"]:checked`);
            if (respostaSelecionada) {
                respostasObjetivas[`q${i}`] = respostaSelecionada.value;
            }
        }

        // Obtém as respostas das questões dissertativas
        var respostasDissertativas = {};
        var numQuestoesDissertativas = 5; // Ajuste conforme o número real de questões dissertativas
        for (var j = 1; j <= numQuestoesDissertativas; j++) {
            var respostaTexto = document.getElementById(`essay${j}`).value;
            respostasDissertativas[`essay${j}`] = respostaTexto;
        }

        // Combina as respostas objetivas e dissertativas
        var respostas = {
            objetivas: respostasObjetivas,
            dissertativas: respostasDissertativas
        };

        userDoc.get().then((doc) => {
            if (doc.exists && doc.data().hasOwnProperty("state")) {
                alert("Você já entregou as suas respostas");
            } else {
                // Atualiza o documento com as respostas e o campo "state"
                userDoc.set({
                    respostas: respostas,
                    state: true
                }, { merge: true }).then(() => {
                   alert("Respostas enviadas com sucesso! Obrigado por participar da 1º Olimpíada Arandu de História!");
                }).catch((error) => {
                    console.error("Erro ao entregar:", error);
                });
            }
        }).catch((error) => {
            console.error("Erro ao consultar o documento:", error);
        });
    } else {
        alert("Nenhum usuário está conectado");
    }
}

function saveDraft(userDoc) {
    // Obtém as respostas das questões objetivas
    var respostasObjetivas = {};
    for (var i = 1; i <= 20; i++) { // Supondo que tenha 20 questões objetivas
        var respostaSelecionada = document.querySelector(`input[name="q${i}"]:checked`);
        if (respostaSelecionada) {
            respostasObjetivas[`q${i}`] = respostaSelecionada.value;
        }
    }

    // Obtém as respostas das questões dissertativas
    var respostasDissertativas = {};
    var numQuestoesDissertativas = 5; // Ajuste conforme o número real de questões dissertativas
    for (var j = 1; j <= numQuestoesDissertativas; j++) {
        var respostaTexto = document.getElementById(`essay${j}`).value;
        respostasDissertativas[`essay${j}`] = respostaTexto;
    }

    // Combina as respostas objetivas e dissertativas
    var respostas = {
        objetivas: respostasObjetivas,
        dissertativas: respostasDissertativas
    };

    userDoc.get().then((doc) => {
        if (doc.exists && doc.data().hasOwnProperty("state")) {
            alert("Você já entregou as suas respostas");
        } else {
            // Atualiza o documento com as respostas e o campo "state"
            userDoc.set({
                respostas: respostas,
            }, { merge: true }).then(() => {
                alert("Rascunho salvo com sucesso!");
            }).catch((error) => {
                console.error("Erro ao entregar:", error);
            });
        }
    }).catch((error) => {
        console.error("Erro ao consultar o documento:", error);
    });
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

function prova1() {
    window.location.href = "https://drive.google.com/file/d/1bk75pURSJXuqaZvl-lw80Oe5RGgBq5be/view?usp=sharing";
}

function prova2() {
    window.location.href = "https://drive.google.com/file/d/1tQPN_Z9fYldZnwPywUA1yFnWmkO9aNBb/view?usp=sharing";
}

function prova3() {
    window.location.href = "https://drive.google.com/file/d/1hvzYPAT6ObqLdwDK0lhWmyIBhcrVnimB/view?usp=sharing";
}

function prova4() {
    window.location.href = "https://drive.google.com/file/d/1ayZAtpw9nnkap82BXkGLAZMF_-x9rsRL/view?usp=sharing";
}

function ajustarAlturaTextarea(textarea) {
    if (textarea.value == "") {
        textarea.style.height = "50px"; // Redefine a altura para calcular o novo tamanho
    } else {
        textarea.style.height = "auto"; // Redefine a altura para calcular o novo tamanho
        textarea.style.height = textarea.scrollHeight + "px"; // Ajusta a altura de acordo com o conteúdo
    }
}

function uploadFile() {
    var fileInput = document.getElementById('file-input');
    var file = fileInput.files[0];

    if (file) {
        // Referência para o armazenamento do Firebase
        var storageRef = firebase.storage().ref();
        var user = firebase.auth().currentUser;

        if (user) {
            var fileRef = storageRef.child('uploads/' + user.uid + '/' + file.name);
            var uploadTask = fileRef.put(file);

            // Monitorar o progresso do upload
            uploadTask.on('state_changed', function(snapshot) {
                var porcentagem = document.getElementById("porcentagem");
                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                porcentagem.innerText = "Progresso do upload: " + progress.toFixed(2) + "%";
            }, function(error) {
                // Tratar erros no upload
                console.error('Erro ao fazer upload:', error);
                alert('Erro ao fazer upload do arquivo.');
            }, function() {
                // Upload concluído com sucesso
                uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                    console.log('Arquivo disponível em:', downloadURL);
                    alert('Arquivo enviado com sucesso! URL: ' + downloadURL);

                    // Aqui você pode salvar a URL do download no Firestore se necessário
                    var userDoc = firebase.firestore().collection('uploads').doc(user.uid);
                    userDoc.set({
                        fileURL: downloadURL
                    }, { merge: true }).then(() => {
                        console.log('URL do arquivo salvo no Firestore com sucesso.');
                    }).catch((error) => {
                        console.error('Erro ao salvar URL do arquivo no Firestore:', error);
                    });
                });
            });
        } else {
            console.log('Nenhum usuário conectado.');
        }
    } else {
        alert('Por favor, selecione um arquivo.');
    }
}

function entregues() {
    var collection = firebase.firestore().collection("respostas-historia2024");

    collection.get().then((querySnapshot) => {
        var totalEntregues = 0;

        querySnapshot.forEach((doc) => {
            var data = doc.data();
            if (data["state"] === true) {
                totalEntregues++;
            }
        });

        document.getElementById("entregues").textContent = "Inscritos individuais que já entregaram: " + totalEntregues + " (" + ((totalEntregues * 100)/776).toFixed(2) + "%)";

    }).catch((error) => {
        console.error("Erro ao consultar documentos:", error);
    });
}

var numero = 0

async function seracorrigido(number) {
    try {
        var collection1 = firebase.firestore().collection("respostas-historia2024");
        var collection2 = firebase.firestore().collection("dados");

        // Obter os documentos
        var querySnapshot1 = await collection1.get();
        var querySnapshot2 = await collection2.get();

        if (number < querySnapshot1.size) {
            var doc1 = querySnapshot1.docs[number];
            var doc2 = querySnapshot2.docs[number];

            if (!doc1.data().respostas.hasOwnProperty("notadiscursiva")) {
                var name = doc2.data().fullName;
                var nivel = doc2.data().level;

                document.getElementById("caluno").textContent = name;
                document.getElementById("cnivel").textContent = nivel;

                var respostas = doc1.data().respostas;
                document.getElementById("cnotaobjetiva").textContent = calcularNotaObjetiva(respostas.objetivas, nivel);
                document.getElementById("cq21").textContent = respostas.dissertativas.essay1;
                document.getElementById("cq22").textContent = respostas.dissertativas.essay2;
                document.getElementById("cq23").textContent = respostas.dissertativas.essay3;
                document.getElementById("cq24").textContent = respostas.dissertativas.essay4;
                document.getElementById("cq25").textContent = respostas.dissertativas.essay5;

                numero = number
            } else {
                seracorrigido(number + 1);
            }
        }
    } catch (error) {
        console.error("Erro ao recuperar dados:", error);
    }
}

function calcularNotaObjetiva(respostasObjetivas, nivel) {
    var nota = 0;
    var gabarito = obterGabarito(nivel); // Função para obter o gabarito para o nível do aluno

    for (var questao in respostasObjetivas) {
        if (respostasObjetivas.hasOwnProperty(questao)) {
            var respostaAluno = respostasObjetivas[questao];
            var respostaCorreta = gabarito[questao];

            if (respostaAluno !== undefined && respostaCorreta !== undefined) {
                respostaAluno = respostaAluno.toLowerCase(); // Convertendo a resposta para minúsculo
                respostaCorreta = respostaCorreta.toLowerCase(); // Convertendo a resposta correta para minúsculo

                if (respostaCorreta === 'anulada') {
                    // Questão anulada, concede ponto automaticamente
                    nota++;
                } else if (respostaAluno === respostaCorreta) {
                    // Se a resposta estiver correta
                    nota++;
                }
            } else if (respostaCorreta === 'anulada') {
                // Questão anulada e a resposta do aluno não foi fornecida
                nota++;
            }
        }
    }

    return nota;
}

function obterGabarito(nivel) {
    const gabaritos = {
        "nível 1": {
            q1: 'c', q2: 'd', q3: 'e', q4: 'a', q5: 'a',
            q6: 'b', q7: 'b', q8: 'd', q9: 'c', q10: 'a',
            q11: 'a', q12: 'b', q13: 'c', q14: 'd', q15: 'b',
            q16: 'a', q17: 'c', q18: 'c', q19: 'b', q20: 'a'
        },
        "nível 2": {
            q1: 'c', q2: 'c', q3: 'c', q4: 'e', q5: 'd',
            q6: 'c', q7: 'c', q8: 'd', q9: 'c', q10: 'c',
            q11: 'c', q12: 'a', q13: 'a', q14: 'a', q15: 'a',
            q16: 'a', q17: 'b', q18: 'd', q19: 'a', q20: 'c'
        },
        "nível 3": {
            q1: 'b', q2: 'e', q3: 'anulada', q4: 'e', q5: 'c',
            q6: 'b', q7: 'd', q8: 'c', q9: 'c', q10: 'c',
            q11: 'a', q12: 'c', q13: 'b', q14: 'b', q15: 'c',
            q16: 'e', q17: 'd', q18: 'd', q19: 'b', q20: 'c'
        },
        "nível 4": {
            q1: 'b', q2: 'a', q3: 'a', q4: 'anulada', q5: 'a',
            q6: 'a', q7: 'b', q8: 'a', q9: 'a', q10: 'a',
            q11: 'a', q12: 'a', q13: 'a', q14: 'a', q15: 'a',
            q16: 'a', q17: 'a', q18: 'a', q19: 'c', q20: 'b'
        }
    };

    return gabaritos[nivel] || {};
}

function salvarcorrecao() {
    var collection1 = firebase.firestore().collection("respostas-historia2024");

    collection1.get().then((querySnapshot) => {
        var docRef = querySnapshot.docs[numero].ref;

        var notaObjetiva = document.getElementById("cnotaobjetiva").textContent;
        var notaDiscursiva = document.getElementById("notadiscursiva").value;

        docRef.update({
            "respostas.notaobjetiva": notaObjetiva,
            "respostas.notadiscursiva": notaDiscursiva
        })
        .then(() => {
            console.log("Document successfully updated!");
        })
        .catch((error) => {
            console.error("Error updating document: ", error);
        });
    }).catch((error) => {
        console.error("Erro ao recuperar dados:", error);
    });

    seracorrigido(numero + 1)
}

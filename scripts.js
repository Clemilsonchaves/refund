// Seleciona os elementos do formulário.
const form = document.querySelector("form")
const amount = document.getElementById("amount")
const expense = document.getElementById("expense")
const category = document.getElementById("category")

// Seleciona os elementos da lista.
const expenseList = document.querySelector("ul")
const expensesQuantity = document.querySelector("aside header p span")
const expensesTotal = document.querySelector("aside header h2")


// Captura o evento de input para formatar o valor.
amount.oninput = () => {  
  // Obtém o valor atual do input e remove os caracteres não númericos.
  let value = amount.value.replace(/\D/g, "")  
  
  // Transforma o valor em centavos (exemplo: 150/100= 1.5 que é equivalente a R$ 1, 50).
  value = Number(value) / 100


  // Atualiza o valor do input
  amount.value = formartCurrencyBRL(value)  
}

function formartCurrencyBRL(value) {
  // Formata o valor no padrão BRL (Real Brasileiro).
  value = value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  }) 

  return value
}

// Captura o evento de submit do formulário e cria um novo gasto.
form.onsubmit = (event) => {
  // Previne o comportamento padrão de recarregar a página.
  event.preventDefault()

  // Cria um objeto com os detalhes na nova despesa.
  const newExpense = {
    id: new Date().getTime(),
    expense: expense.value,
    category_id: category.value,
    category_name: category.options[category.selectedIndex].text,
    amount: amount.value,
    created_at: new Date(),
  }

  // Chama a função que irá adicionar o item na lista . 
  expenseAdd(newExpense)
}

// Adiciona um novo item na lista
function expenseAdd(newExpense){
  try {
    // Cria o elemento de li para adicionar o item  na lista (ul).
    const expenseItem = document.createElement("li")
    expenseItem.classList.add("expense")

    // Cria o ícone da categoria.
    const expenseIcon = document.createElement("img")
    expenseIcon.setAttribute("src", `img/${newExpense.category_id}.svg`)
    expenseIcon.setAttribute("alt", newExpense.category_name) 

    // Cria a info da despesa.
    const expenseInfo = document.createElement("div")
    expenseInfo.classList.add("expense-info")

    // Criar o nome da despesa.
    const expenseName = document.createElement("strong")
    expenseName.textContent = newExpense.expense

    // Criar a categoria da despesa
    const expenseCategory = document.createElement("span")
    expenseCategory.textContent = newExpense.category_name

    // Adiciona nome e categoria na div das informações das despesas.
    expenseInfo.append(expenseName, expenseCategory)

    // Criar o valor da despesa.
    const expenseAmount = document.createElement("span")
    expenseAmount.classList.add("expense-amount")
    expenseAmount.innerHTML = `<small>R$</small>${newExpense.amount.toUpperCase().replace("R$", "")}` 

    // Cria o ícone de remover 
    const removeIcon = document.createElement("img")
    removeIcon.classList.add("remove-icon")
    removeIcon.setAttribute("src", "img/remove.svg")
    removeIcon.setAttribute("alt", "Remover")
    
    // Adiciona as informações no item.
    expenseItem.append(expenseIcon, expenseInfo, expenseAmount, removeIcon)

    //Adiciona o item na lista.
    expenseList.append(expenseItem)

    // Limpa o formulário para adicionar um novo item.
    formClear()

    // Atualiza os totais
    updateTotals()
  } catch (error){
    alert("Não foi possível atualizar a lista de despesas.")
    console.log(error)
  }
}

// Atualiza os totais
function updateTotals(){
 try{
   //Recupera todos os itens (li) da lista (ul)
   const items = expenseList.children

   // Atualiza a quantidade de itens na lista.
   expensesQuantity.textContent = `${items.length} ${
    items.length > 1 ? "Despesas" : "Despesa"
  }`
   
  // Variável para incrementar o total
  let total = 0

  // Percorre cada item (li) da lista (ul)
  for(let item = 0; item < items.length; item++) {
    const itemAmount = items[item].querySelector(".expense-amount")
    
    // Remover caracteres não numéricos e substitui a vírgula  pelo ponto.
    let value = itemAmount.textContent.replace(/[^\d,]/g, "").replace(",",".")

    // Converter o valor para float
    value = parseFloat(value)

    // Verificar se é um número válido
    if(isNaN(value)) {
      return alert("Não foi possível calcular o total. O valor não parece ser um número")
    }
    // Incrementar o valor total
    total += Number(value)
  }
  
 // Criar a span para adicionar o R$ formatado.
 const symbolBLR = document.createElement("small")
  symbolBLR.textContent = "R$"
 
  // Formatar o valor e remove o R$ que será exibido pela small com o stilo customizado.
  total = formartCurrencyBRL(total).toUpperCase().replace("R$", "")

  // Limpar o conteúdo do elemento.
  expensesTotal.innerHTML = ""

  // Adicionar o símbolo da moeda e o valor total formatado
   expensesTotal.append(symbolBLR, total)

 } catch (error) {
   console.log(error)
   alert("Não foi possível atualizar os totais.")
 }
}

// Evento que captura o click nos itens da lista.
expenseList.addEventListener("click", function (event) {
  // Verificar se o elemento clicado é o ícone de remover
  if(event.target.classList.contains("remove-icon")){
    // Obtém a li do elemento clicado.
    const item = event.target.closest(".expense")

    // Remove item da lista. 
    item.remove()
  }
 
  // Atualiza os totais.
  updateTotals()
}) 

function formClear(){
  // Limpa os valores dos inputs.
  amount.value = ""
  expense.value = ""
  category.value = ""

  // Coloca o foco no input de amount
  expense.focus()
}
 
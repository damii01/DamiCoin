# DamiCoin
### Sveučilišni diplomski studij

  

### Informatika Informacijska sigurnost i blockchain tehnologije

  

### Izvješće projektnog zadatka

  

**Autor**: Damjan Kraljić

  

Rijeka, veljača 2025.

  

## Pametni ugovor

  

    pragma solidity >=0.7.0 <=0.8.0;

  

Ovim dijelom koda dopušteno je kompajliranje istog s verzijom Solidityja između 0.7.0 i 0.8.0, za kompajliranje se točnije koristila verzija 0.7.6 zbog poteškoća testiranja koda na Ganache mreži s novijim verzijama Solidityja.

  

    contract DamiCoin {
    
	     string public name = "DamiCoin";
		 string public symbol = "DCO";
		 
		 uint256 public totalSupply;
		 address public owner;

  

Ovdje se nalazi definicija ugovora (DamiCoin) te se definiraju te i inicijaliziraju javne globalne varijable name (ime tokena), symbol (simbol ili kratica tokena), totalSupply (sveukupna količina tokena) te owner (adresa vlasnika tokena).

  

    mapping(address => uint256) private balances;

  

Mapiraju se adrese s količinom tokena koja svaka adresa posjeduje. Tipa je private kako se ne bi omogućilo mijenjanje vrijednosti te pristup ove varijable je omogućen samo preko funkcije balanceOf koja prikazuje količinu tokena određene adrese koja je poslana kao parametar funkciji.

  

    event Transfer(address indexed from, address indexed to, uint256 value);
    
    event Mint(address indexed to, uint256 amount);
    
    event Burn(address indexed from, uint256 amount);

  

U nastavku implementirani su eventi Transfer, Mint te Burn; ujedno su nazivi funkcija koji će se kasnije opisati i koje će omogućiti slanje (transfer), povećavanje ukupne ponude (mint) te smanjenje ukupne ponude (burn).

  

Potrebno je izraditi evente kako bi svi korisnici ovog pametnog ugovora u blockchainu imali uvid u transfere, mintanje i burnanje tokena jer se isti zapisuju kad se event pozove pomoću emita.

  

Event Transfer prima kao parametre adresu pošiljatelja, adresu primatelja te količinu tokena koji će se poslati od adrese pošiljatelja na adresu primatelja.

  

Event Mint prima adresu vlasnika „to“ zato što ta količina (parametar amount) tokena koja se minta idu vlasniku i oni povećavaju količinu ukupne ponude tokena.

  

Event Burn prima adresu vlasnika „from“ zato što ta količina (parametar amount) tokena koja se burna skidaju se vlasniku te se zatim smanjuje ukupna ponuda tokena.

  

    constructor(uint256 initialSupply) {
	    owner = msg.sender;
	    totalSupply = initialSupply;
	    balances[owner] = initialSupply;
	    emit Transfer(address(0), owner, initialSupply);
    }

  

Konstruktor se poziva svaki put kad se deploya pametni ugovor, prima jedan parametar: InitialSupply koji je ujedno količina tokena koja će se postaviti kao sveukupna količina do tog trenutka. Vlasnik (owner) postaje onaj koji je deployao pametni ugovor te se njemu dodjeljuju svi inicijalizirani tokeni.

  

Zatim se emitira transfer, odnosno se izvršava transakcija tokena od adrese 0 na adresu vlasnika, te količina je ona postavljena kao početna.

  

    function balanceOf(address account) public view returns (uint256) {
	    return balances[account];
    }

  

Funckija balanceOf je javna te prima jedan parametar odnosno adresu profila za koji se želi provjeriti količina tokena. Funkcija vraća količinu tokena poslanog profila putem parametra. Pošto funkcija ne mijenja sadržaj ista je tipa view.

  

    function transfer(address recipient, uint256 amount) public returns (bool) {
	    require(recipient != address(0), "Nevaljana adresa");
	    require(balances[msg.sender] >= amount, "Nedovoljno tokena za transfer");
	    balances[msg.sender] -= amount;
	    balances[recipient] += amount;
	    emit Transfer(msg.sender, recipient, amount);
	    return true;
    }

  

Funkcija transfer sadrži parametre: adresa primatelja (recipient) te količinu tokena (amount), javna je te vraća vrijednost tipa bool, true ako se transfer uspješno završi u suprotnome false.

  

Provjerava se da primatelj nema adresu 0 (ista nije valjana) te ako pošiljatelj ima dovoljno tokena za slanje odnosno da je količina tokena koju pošiljatelj šalje manja ili jednaka ukupnoj njegovoj količini.

  

Zatim se oduzima količina tokena pošiljatelju te se ista dodaje primatelju. Emitira se Transfer odnosno zabilježi se transfer između pošiljatelja, primatelja s količinom X tokena. Te na kraju se vraća vrijednost true kako bi se signalizirala uspješnost samog transfera.

  
  
  

    function mint(uint256 amount) public onlyOwner returns (bool) {
	    totalSupply += amount;
	    balances[owner] += amount;
	    emit Mint(owner, amount);
	    return true;
    }

  

Funkcija mint prima jedan parametar tipa uint256 amount (količina), javna je i samo vlasnik ju može izvršiti (modificator onlyOwer), vraća boolean vrijednost.

  

Povećava se ukupna količina tokena za vrijednost u varijabli „amount“, također se za istu vrijednost povećava količina tokena na vlasnikovom računu. Emitira se mintanje kako bi se mogli pratiti novi tokeni. Zatim se vraća vrijednost true.

  

    function burn(uint256 amount) public onlyOwner returns (bool) {
	    require(balances[owner] >= amount, "Nedovoljno tokena za burn");
	    totalSupply -= amount;
	    balances[owner] -= amount;
	    emit Burn(owner, amount);
	    return true;
    }

  

Funkcija burn prima jedan parametar tipa uint256 amount (količina), javna je i samo vlasnik ju može izvršiti (modificator onlyOwer), vraća boolean vrijednost.

  

Provjerava se da vlasnik ima dovoljno tokena za burnanje.

  

Smanjuje se ukupna količina tokena za vrijednost u varijabli „amount“, također se za istu vrijednost smanjuje količina tokena na vlasnikovom računu. Emitira se burnanje kako bi svi korisnici blockchaina imali uvid u burnanje tokena . Zatim se vraća vrijednost true.

  
  

    modifier onlyOwner() {
	    require(msg.sender == owner, "Samo vlasnik moze izvrsiti ovu funkciju");
	    \_;
    }

  

Modifikator onlyOwner provjerava je li osoba koja poziva funkciju (msg.sender) jednaka vlasniku ugovora, ako nije, funkcija se odmah prekida uz poruku "Samo vlasnik moze izvrsiti ovu funkciju".

  

\_;  označava kraj.

  

## Testiranje

  

Ganache se koristio kao alat za testiranje rada pametnog ugovora „DamiCoin“ i njegovih funkcija.

  

Prvi korak je bila instalacija programa „Ganache“ na adresi: <https://archive.trufflesuite.com/ganache/>

  

Nakon instalacije programa bilo je potrebno stvoriti novi projekt (workspace) na etherumu.

  

Postavio se naziv workspace („zavrsni“), te su se zadržale defaultne vrijednosti servera:

  

> **127.0.0.1** za IP adresu
> 
>   
> 
> **8545** za broj porta
> 
>   
> 
> **5777** kao network ID
> 
>   
> 
> Automine- **uključen**
> 
>   
> 
> Error on transaction failure – **isključen** (zbog problema s ovom
> opcijom i prikaz greške za gas failure)

  

Sve ostale vrijednosti u postavkama nisu mijenjane.

  

### Testiranje u Remix IDE-u

  

Prvo testiranje se odradilo u Remix IDE-u, postavio se „*Enviroment*“ u sekciji „*Deploy & run transactions*“ na „*Custom – External Http Provider*“ te se endpoint postavio na [http://127.0.0.1:8545](http://127.0.0.1:8545).

  

Zatim se postavila početna količina tokena i deployao pametni ugovor, testirale su se sve funkcije i provjerile sve varijable.

  

### Testiranje putem Truffle-a i na Web3.js-u

  

Kako bi se omogućila izrada manje web aplikacije u web3.js-u, bilo je potrebno deployati lokalno pametni ugovor.

  

Za to se koristio truffle (instalacija na <https://archive.trufflesuite.com/docs/truffle/how-to/install/>)

  

Stvorio je folder „DamiCoin“ ta zatim putem cmd-a se ušlo u folder i postavio truffle projekt s komandom „*truffle unbox*“.

  

S tom komandom su se stvorili folderi i datoteke:

  

> - contracts/
> 
> - migrations/:
> 
> - test/:
> 
> - truffle-config.js:

  

U *contacts* se postavio isti kod koji se nalazio u Remix IDE-u u datoteku DamiCoin.sol

  

U *migrations* se dodala datoteka 2\_DamiCoin\_migration koja sadrži kod za deployanje.

  

U truffle-config.js datoteci su se postavili isti podaci IP adrese, porta, network ID-a i sl. kao što su postavljeni u Ganache testnoj mreži. Kompajler je postavljen na verziju **0.7.6.**

  

Povezali su se Ganache i Truffle u postavkama Ganache-a u sekciji “Workspace” pod “Truffle-projects”, odabrala se putanja na truffle-config.js.

  

Naredbom „*truffle* *migrate*“ deployao se pametni ugovor te se moglo isto vidjeli iz Ganache-a pod sekcijom „*Contracts*“.

  

>     *Compiling your contracts...*
>   
>     *===========================*
>  
>     *> Compiling .\contracts\DamiCoin.sol*
>     *> Compiling .\contracts\DamiCoin.sol*
>     *> Compiling .\contracts\Migrations.sol*
>     *> Artifacts written to 
> 
> 	  C:\Users\damja\Desktop\DamiCoin\build\contracts*
>     
>     *> Compiled successfully using:*
>     
>     *- solc: 0.7.6+commit.7338295f.Emscripten.clang*
>     
>     *Network up to date.*

  

S ovim korakom se stvara novi folder ./build/contract gdje se pohranjuje deployani pametni ugovor.

  

Zatim se izradila web aplikacija u html-u, css-u i js-u kako bi se mogle lokalno koristiti funkcije pametnog ugovora.

  

Nije se instalirao web3.js preko nmp nego s ovom naredbom u html datoteci:

  


      <script src="https://cdnjs.cloudflare.com/ajax/libs/web3/1.8.1/web3.min.js"></script>

  

Korišteni ABI se nalazi ili u Remix IDE-u ili pod ./build/contacts/DamiCoin.json -> “abi”.


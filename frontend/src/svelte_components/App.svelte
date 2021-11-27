<script lang="ts">
    import { ethers } from "ethers";
    import MoodContractABI from "../../artifacts/contracts/MoodContract.sol/MoodContract.json";

    // window.ethereum.enable();

    let allMoods;

    const moodContractAddress = "0x7969c5eD335650692Bc04293B07F5BF2e7A673C0";

     // request access to the user's MetaMask account
    async function requestAccount() {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
    }

    // get the mood contract
    function getMoodContract() {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const moodContract = new ethers.Contract(moodContractAddress, MoodContractABI.abi, signer);

        return moodContract;
    }

    async function getAllMoods() {
        // await requestAccount();
        const moodContract = getMoodContract();
        const _allMoods = await moodContract.getAllMoods();

        Object.keys(_allMoods).forEach(key => {
            console.log("address: ", _allMoods[key]["responder"]);
            console.log("mood: ", _allMoods[key]["mood"]);
        });
    }
    

    async function setMood() {
        await requestAccount();

        const moodContract = getMoodContract();
        let txn = await moodContract.setMood("wagmiss");
        await txn.wait();

        getAllMoods();
    }

getAllMoods();
</script>

<button on:click={setMood}>set Mood</button>

{allMoods}

sdf
<!-- <h1>The greeting is: {greeeting}</h1> -->

<!-- <button on:click={getGreeting}>show greeeting</button>
<button on:click={setGreeting}>set greeeting</button>


 -->

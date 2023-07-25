import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment } from "hardhat/types";

task("balance", "Prints an account's balance")
    .addOptionalParam("account", "The account's address", "")
    .setAction(async (taskArgs: any, hre: HardhatRuntimeEnvironment) => {
        const { ethers } = hre;
        const accs = await ethers.getSigners();
        const account = taskArgs.account || accs[0].address;
        const balance = await ethers.provider.getBalance(account);

        console.log(ethers.utils.formatEther(balance), "ETH");
    });

task("get-inviter", "Prints an account's inviter")
    .addOptionalParam("contract", "The contract address", "")
    .addOptionalParam("address", "The account's address", "")
    .setAction(async (taskArgs: any, hre: HardhatRuntimeEnvironment) => {
        const { ethers, deployments } = hre;

        let contractAddress = taskArgs.contract;
        if (contractAddress === "") {
            contractAddress = (await deployments.get("Invitations")).address;
        }
        const Invitations = await ethers.getContractAt("Invitations", contractAddress);
        const inviter = await Invitations.getInviter(taskArgs.address);
        console.log("inviter", inviter);
    })

task("get-invitees", "Prints an account's list of invitees")
    .addOptionalParam("contract", "The contract address", "")
    .addOptionalParam("address", "The account's address", "")
    .setAction(async (taskArgs: any, hre: HardhatRuntimeEnvironment) => {
        const { ethers, deployments } = hre;

        let contractAddress = taskArgs.contract;
        if (contractAddress === "") {
            contractAddress = (await deployments.get("Invitations")).address;
        }
        const Invitations = await ethers.getContractAt("Invitations", contractAddress);
        const invitees = await Invitations.getInvitees(taskArgs.address);
        console.log("invitees", invitees);
    })

task("invite", "Invite a new account")
    .addOptionalParam("contract", "The contract address", "")
    .addOptionalParam("from", "The inviter's address", "")
    .addOptionalParam("invitee", "The invitees's address", "")
    .setAction(async (taskArgs: any, hre: HardhatRuntimeEnvironment) => {
        const { ethers, deployments } = hre;

        let contractAddress = taskArgs.contract;
        if (contractAddress === "") {
            contractAddress = (await deployments.get("Invitations")).address;
        }
        let signerAddress = taskArgs.from;
        if (signerAddress === "") {
            const accs = await ethers.getSigners();
            signerAddress = accs[0].address;
        }
        let signer = await ethers.getSigner(signerAddress);

        const Invitations = await ethers.getContractAt("Invitations", contractAddress, signer);
        const tx = await Invitations.invite(taskArgs.invitee);
        console.log("tx", tx);
    })

task("grant-role", "Invite a new account")
    .addOptionalParam("contract", "The contract address", "")
    .addOptionalParam("from", "The inviter's address", "")
    .addOptionalParam("invitee", "The invitees's address", "")
    .setAction(async (taskArgs: any, hre: HardhatRuntimeEnvironment) => {
        const { ethers, deployments } = hre;

        let contractAddress = taskArgs.contract;
        if (contractAddress === "") {
            contractAddress = (await deployments.get("Invitations")).address;
        }
        let signerAddress = taskArgs.from;
        if (signerAddress === "") {
            const accs = await ethers.getSigners();
            signerAddress = accs[0].address;
        }
        let signer = await ethers.getSigner(signerAddress);

        const Invitations = await ethers.getContractAt("Invitations", contractAddress, signer);
        const tx = await Invitations.grantRole(await Invitations.INVITER_ROLE(), taskArgs.invitee);
        console.log("tx", tx);
    })



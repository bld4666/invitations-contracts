import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';

const func: DeployFunction = async function(hre: HardhatRuntimeEnvironment) {
    const { deployments, getNamedAccounts } = hre;
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();

    await deploy('Invitations', {
        from: deployer,
        proxy: {
            proxyContract: 'OpenZeppelinTransparentProxy',
            execute: {
                init: {
                    methodName: 'initialize',
                    args: [],
                },
                // onUpgrade: {
                //     methodName: 'afterUpgrade',
                //     args: [],
                // },
            },
        },
        args: [],
        log: true,
    });
};

func.tags = ['1', 'Invitations'];
func.dependencies = [];
export default func;

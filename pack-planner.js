const readline = require('readline');

class Item {
    constructor(itemId, itemLength, itemQuantity, pieceWeight) {
        this.itemId = itemId;
        this.itemLength = parseInt(itemLength);
        this.itemQuantity = parseInt(itemQuantity);
        this.pieceWeight = parseFloat(pieceWeight);
    }
}

class Pack {
    constructor(packNumber) {
        this.packNumber = packNumber;
        this.items = [];
        this.packLength = 0;
        this.packWeight = 0.0;
    }

    addItem(item, quantity) {
        this.items.push({
            itemId: item.itemId,
            itemLength: item.itemLength,
            itemQuantity: quantity,
            pieceWeight: item.pieceWeight
        });
        this.packLength = Math.max(this.packLength, item.itemLength);
        this.packWeight += quantity * item.pieceWeight;
    }

    print() {
        console.log(`Pack Number: ${this.packNumber}`);
        this.items.forEach(item => {
            console.log(`${item.itemId},${item.itemLength},${item.itemQuantity},${item.pieceWeight}`);
        });
        console.log(`Pack Length: ${this.packLength}, Pack Weight: ${this.packWeight.toFixed(2)}`);
    }
}

class PackPlanner {
    constructor(maxPiecesPerPack, maxWeightPerPack) {
        this.maxPiecesPerPack = maxPiecesPerPack;
        this.maxWeightPerPack = maxWeightPerPack;
        this.packs = [];
    }

    createPack() {
        const pack = new Pack(this.packs.length + 1);
        this.packs.push(pack);
        return pack;
    }

    addItem(item) {
        let remainingQuantity = item.itemQuantity;

        while (remainingQuantity > 0) {
            let currentPack = this.packs.find(pack => 
                (pack.packWeight + item.pieceWeight <= this.maxWeightPerPack) &&
                (pack.items.reduce((acc, cur) => acc + cur.itemQuantity, 0) < this.maxPiecesPerPack)
            );

            if (!currentPack) {
                currentPack = this.createPack();
            }

            const availableSpace = this.maxPiecesPerPack - currentPack.items.reduce((acc, cur) => acc + cur.itemQuantity, 0);
            const quantityToAdd = Math.min(remainingQuantity, availableSpace);

            currentPack.addItem(item, quantityToAdd);
            remainingQuantity -= quantityToAdd;
        }
    }

    printPacks() {
        this.packs.forEach(pack => pack.print());
    }
}

let sortOrder, maxPiecesPerPack, maxWeightPerPack;
let items = [];
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});

rl.on('line', function(line) {
    if (!line) {
        if (sortOrder === "SHORT_TO_LONG") {
            items.sort((a, b) => a.itemLength - b.itemLength);
        } else if (sortOrder === "LONG_TO_SHORT") {
            items.sort((a, b) => b.itemLength - a.itemLength);
        }

        const planner = new PackPlanner(maxPiecesPerPack, maxWeightPerPack);
        items.forEach(item => planner.addItem(item));
        planner.printPacks();

        process.exit(0);
    }

    if (!sortOrder) {
        [sortOrder, maxPiecesPerPack, maxWeightPerPack] = line.split(',');
        maxPiecesPerPack = parseInt(maxPiecesPerPack);
        maxWeightPerPack = parseFloat(maxWeightPerPack);
    } else {
        items.push(new Item(...line.split(',')));
    }
});

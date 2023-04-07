class Good {
    constructor(id, name, description, sizes, price, available) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.sizes = sizes;
        this.price = price;
        this.available = available;
    }
    setAvailable(changeAvailable) {
        this.available = changeAvailable;
    }
}

class GoodList {
    #goods
    constructor (filter, sortPrice, sortDir) {
        this.#goods = [];
        this.filter = filter;
        this.sortPrice = sortPrice;
        this.sortDir = sortDir;
    }
    get list() {
        const forSaleList = this.#goods.filter(good => this.filter.test(good.name));
        if (!this.sortPrice) {
            return forSaleList;
        }
        if (this.sortDir) {
            return forSaleList.sort((a, b) => (a.price - b.price));
        }
        return forSaleList.sort((a, b) => (b.price - a.price));
    }
    add (newGood) {
        this.#goods.push(newGood);
    }
    remove(id) {
        const getIndex = this.#goods.findIndex(good => good.id === id);
        if (getIndex != undefined) {
            this.#goods.splice(getIndex, 1);
        }
        return getIndex;
    }

}

class BasketGood extends Good {
    constructor (id, name, description, sizes, price, available, amount) {
        super(id, name, description, sizes, price, available);
        this.amount = amount;
    }
} 

class Basket {
    constructor() {
        this.goods = []
    }
    get totalAmount() {
        return this.goods.map(item => item.amount).reduce ((a,b) => a+b,0);
    }
    get totalSum() {
        return this.goods.reduce((a, b) => a + b.amount * b.price, 0);
    }
    add (good, amount) {
        let index = this.goods.findIndex(value => value.id === good.id);
        if (index >= 0) {
            this.goods[index].amount += amount;
        } else {
            let addGood = new BasketGood(good.id, good.name, good.description, good.sizes, good.price, good.available, amount);
            this.goods.push(addGood);
        }
    }
    remove (good, amount) {
        let index = this.goods.findIndex(value => value.id === good.id);
        if (index >= 0) {
            if (this.goods[index].amount - amount <= 0) {
                this.goods.splice(index, 1);
            } else {this.goods[index].amount -= amount}
        }
    }
    clear() {
        return (this.goods.splice(0,this.goods.length));
    }
    removeUnavailable() {
        this.goods.filter(good => good.available === false).forEach(value => this.remove(value));
    }
}

const g1 = new Good(1, 'shorts', 'shorts mans', [44,46,48,50,52], 2100, true);
const g2 = new Good(1, 'jeans', 'jeans', [44,46,48,50,52], 3300, true);
const g3 = new Good(1, 'skirt', 'skirt', [44,48,50,52], 1200, true);
const g4 = new Good(1, 'shirt', 'shirt', [44,46,50,52], 1400, true);
const g5 = new Good(1, 'cap', 'cap', [44,46,48,52], 700, true);

const catalog = new GoodList(/jeans/i, true, false);

catalog.add(g1);
catalog.add(g2);
catalog.add(g3);
catalog.add(g4);
catalog.add(g5);

catalog.sortPrice = true;
catalog.sortDir = false;

catalog.remove(4);

const basket = new Basket();

basket.add(g1, 1);
basket.add(g2, 2);
basket.add(g3, 3);
basket.add(g4, 4);
basket.add(g5, 5);

console.log(`Total items in shopping cart: ${basket.totalAmount}`);
console.log(`Total sum for ${basket.totalAmount} items in a cart is: $${basket.totalSum}`);

basket.remove(g2, 1);
basket.remove(g3, 2);

basket.removeUnavailable();

basket.clear();
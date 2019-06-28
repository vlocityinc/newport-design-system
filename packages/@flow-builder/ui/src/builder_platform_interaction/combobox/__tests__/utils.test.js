import {
    sliceMenu,
    getMenuLength,
    setSelectableMenuItem
} from '../utils';


const flatMenu = [{
    value: 1
}, {
    value: 2
}, {
    value: 3
}, {
    value: 4
}];

const groupedMenu = [{
    value: 0,
    items: [{
        value: 'subitem.0.0'
    }, {
        value: 'subitem.0.1'
    }, {
        value: 'subitem.0.2'
    }, {
        value: 'subitem.0.3'
    }]
}, {
    value: 1,
    items: [{
        value: 'subitem.1.0'
    }, {
        value: 'subitem.1.1'
    }, {
        value: 'subitem.1.2'
    }, {
        value: 'subitem.1.3'
    }]
}, {
    value: 2,
    items: [{
        value: 'subitem.2.0'
    }, {
        value: 'subitem.2.1'
    }, {
        value: 'subitem.2.2'
    }, {
        value: 'subitem.2.3'
    }]
}, {
    value: 3,
    items: [{
        value: 'subitem.3.0'
    }, {
        value: 'subitem.3.1'
    }, {
        value: 'subitem.3.2'
    }, {
        value: 'subitem.3.3'
    }]
}];

const mixedMenu = [{
    value: 'item 1'
}, {
    value: 1,
    items: [{
        value: 'subitem.1.0'
    }, {
        value: 'subitem.1.1'
    }, {
        value: 'subitem.1.2'
    }, {
        value: 'subitem.1.3'
    }]
}, {
    value: 'item 2'
}, {
    value: 3,
    items: [{
        value: 'subitem.3.0'
    }, {
        value: 'subitem.3.1'
    }, {
        value: 'subitem.3.2'
    }, {
        value: 'subitem.3.3'
    }]
}];

describe('Combobox Menu Utils', () => {
    describe('sliceMenu', () => {
        describe('flat menu', () => {
            const menu = flatMenu;

            it('should slice first three items', () => {
                expect(sliceMenu(menu, 3)).toEqual({
                    menu: [menu[0], menu[1], menu[2]],
                    length: 3
                });
            });

            it('should return all items', () => {
                expect(sliceMenu(menu, 5)).toEqual({
                    menu,
                    length: 4
                });
            });

            it('should slice no menu', () => {
                expect(sliceMenu(menu, 0)).toEqual({
                    menu: [],
                    length: 0
                });
            });
        });

        describe('grouped menu', () => {
            const menu = groupedMenu;

            it('should slice first three items', () => {
                expect(sliceMenu(menu, 3)).toEqual({
                    menu: [{
                        value: 0,
                        items: [{
                            value: 'subitem.0.0'
                        }, {
                            value: 'subitem.0.1'
                        }]
                    }],
                    length: 3
                });
            });

            it('should slice first seven items', () => {
                expect(sliceMenu(menu, 7)).toEqual({
                    menu: [{
                        value: 0,
                        items: [{
                            value: 'subitem.0.0'
                        }, {
                            value: 'subitem.0.1'
                        }, {
                            value: 'subitem.0.2'
                        }, {
                            value: 'subitem.0.3'
                        }]
                    }, {
                        value: 1,
                        items: [{
                            value: 'subitem.1.0'
                        }]
                    }],
                    length: 7
                });
            });

            it('should slice no menu', () => {
                expect(sliceMenu(menu, 0)).toEqual({
                    menu: [],
                    length: 0
                });
            });
        });

        it('should slice no menu', () => {
            expect(sliceMenu(undefined, 5)).toEqual({
                menu: [],
                length: 0
            });

            expect(sliceMenu(null, 5)).toEqual({
                menu: [],
                length: 0
            });

            expect(sliceMenu('a', 5)).toEqual({
                menu: [],
                length: 0
            });

            expect(sliceMenu(555, 5)).toEqual({
                menu: [],
                length: 0
            });

            expect(sliceMenu([], 5)).toEqual({
                menu: [],
                length: 0
            });
        });
    });

    describe('getMenuLength', () => {
        it('should compute flat menu length', () => {
            const menu = [{
                value: 1
            }, {
                value: 2
            }, {
                value: 3
            }, {
                value: 4
            }];
            expect(getMenuLength(menu)).toEqual(4);
        });

        it('should compute the length of no menu as 0', () => {
            expect(getMenuLength([])).toEqual(0);
            expect(getMenuLength(null)).toEqual(0);
            expect(getMenuLength(undefined)).toEqual(0);
            expect(getMenuLength('abc')).toEqual(0);
            expect(getMenuLength(123)).toEqual(0);
        });

        describe('grouped menu', () => {
            it('should the compute legth of a fully grouped menu', () => {
                expect(getMenuLength(groupedMenu)).toEqual(20);
            });

            it('should the compute legth of a mixed grouped menu', () => {
                expect(getMenuLength(mixedMenu)).toEqual(12);
            });
        });
    });

    describe('setSelectableMenuItem', () => {
        describe('flat menu', () => {
            it('should update a valid item', () => {
                const menu = [{
                    value: 1,
                    type: 'option-card'
                }, {
                    value: 2,
                    type: 'option-card'
                }, {
                    value: 3,
                    type: 'option-card'
                }, {
                    value: 4,
                    type: 'option-card'
                }];
                setSelectableMenuItem(menu, 2, () => ({ passed: true }));
                expect(menu).toEqual([{
                    value: 1,
                    type: 'option-card'
                }, {
                    value: 2,
                    type: 'option-card'
                }, {
                    passed: true
                }, {
                    value: 4,
                    type: 'option-card'
                }]);

                setSelectableMenuItem(menu, 0, () => ({ abc: 123 }));
                expect(menu).toEqual([{
                    abc: 123
                }, {
                    value: 2,
                    type: 'option-card'
                }, {
                    passed: true
                }, {
                    value: 4,
                    type: 'option-card'
                }]);
            });

            it('should update no items when index is not valid', () => {
                const menu = [{
                    value: 1,
                    type: 'option-card'
                }, {
                    value: 2,
                    type: 'option-card'
                }, {
                    value: 3,
                    type: 'option-card'
                }, {
                    value: 4,
                    type: 'option-card'
                }];
                setSelectableMenuItem(menu, 10, () => ({ passed: true }));
                expect(menu).toEqual([{
                    value: 1,
                    type: 'option-card'
                }, {
                    value: 2,
                    type: 'option-card'
                }, {
                    value: 3,
                    type: 'option-card'
                }, {
                    value: 4,
                    type: 'option-card'
                }]);
            });
        });

        describe('grouped menu', () => {
            it('should update a selectable subitem', () => {
                const menu = [{
                    value: 0,
                    items: [{
                        value: 'subitem.0.0',
                        type: 'option-card'
                    }, {
                        value: 'subitem.0.1',
                        type: 'option-card'
                    }, {
                        value: 'subitem.0.2',
                        type: 'option-card'
                    }, {
                        value: 'subitem.0.3',
                        type: 'option-card'
                    }]
                }, {
                    value: 1,
                    items: [{
                        value: 'subitem.1.0',
                        type: 'option-card'
                    }, {
                        value: 'subitem.1.1',
                        type: 'option-card'
                    }]
                }];

                setSelectableMenuItem(menu, 2, () => ({ ok: 'not'}));
                expect(menu).toEqual([{
                    value: 0,
                    items: [{
                        value: 'subitem.0.0',
                        type: 'option-card'
                    }, {
                        ok: 'not'
                    }, {
                        value: 'subitem.0.2',
                        type: 'option-card'
                    }, {
                        value: 'subitem.0.3',
                        type: 'option-card'
                    }]
                }, {
                    value: 1,
                    items: [{
                        value: 'subitem.1.0',
                        type: 'option-card'
                    }, {
                        value: 'subitem.1.1',
                        type: 'option-card'
                    }]
                }]);
            });

            it('should update a selectable top item', () => {
                const menu = [{
                    value: 0,
                    items: [{
                        value: 'subitem.0.0',
                        type: 'option-card'
                    }, {
                        value: 'subitem.0.1',
                        type: 'option-card'
                    }]
                }, {
                    value: 1,
                    type: 'option-card',
                    items: [{
                        value: 'subitem.1.0',
                        type: 'option-card'
                    }, {
                        value: 'subitem.1.1',
                        type: 'option-card'
                    }]
                }];
                setSelectableMenuItem(menu, 3, () => ({ ok: 'not' }));
                expect(menu).toEqual([{
                    value: 0,
                    items: [{
                        value: 'subitem.0.0',
                        type: 'option-card'
                    }, {
                        value: 'subitem.0.1',
                        type: 'option-card'
                    }]
                }, {
                    ok: 'not'
                }]);
            });

            it('should update a next sibling selectable subitem', () => {
                const menu = [{
                    value: 0,
                    items: [{
                        value: 'subitem.0.0',
                        type: 'option-card'
                    }, {
                        value: 'subitem.0.1',
                        type: 'option-card'
                    }]
                }, {
                    value: 1,
                    items: [{
                        value: 'subitem.1.0'
                    }, {
                        value: 'subitem.1.1',
                        type: 'option-card'
                    }]
                }];
                setSelectableMenuItem(menu, 4, () => ({ ok: 'not' }));
                expect(menu).toEqual([{
                    value: 0,
                    items: [{
                        value: 'subitem.0.0',
                        type: 'option-card'
                    }, {
                        value: 'subitem.0.1',
                        type: 'option-card'
                    }]
                }, {
                    value: 1,
                    items: [{
                        value: 'subitem.1.0'
                    }, {
                        ok: 'not'
                    }]
                }]);
            });

            it('should update a previous sibling selectable subitem', () => {
                const menu = [{
                    value: 0,
                    type: 'option-card',
                    items: [{
                        value: 'subitem.0.0',
                        type: 'option-card'
                    }, {
                        value: 'subitem.0.1',
                        type: 'option-card'
                    }]
                }, {
                    value: 1,
                    items: [{
                        value: 'subitem.1.0',
                        type: 'option-card'
                    }, {
                        value: 'subitem.1.1'
                    }, {
                        value: 'subitem.1.2'
                    }]
                }];
                setSelectableMenuItem(menu, 4, () => ({ ok: 'not' }));
                expect(menu).toEqual([{
                    value: 0,
                    type: 'option-card',
                    items: [{
                        value: 'subitem.0.0',
                        type: 'option-card'
                    }, {
                        value: 'subitem.0.1',
                        type: 'option-card'
                    }]
                }, {
                    value: 1,
                    items: [{
                        ok: 'not'
                    }, {
                        value: 'subitem.1.1'
                    }, {
                        value: 'subitem.1.2'
                    }]
                }]);
            });
        });
    });
});
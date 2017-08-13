import React, {Component} from "react";
import {ActivityIndicator, AsyncStorage, Keyboard, ListView, Platform, StyleSheet, View} from "react-native";

import Header from './header';
import Footer from './footer';
import Row from './row';
import {FilterOptions} from './filterOptions';

const ItemKey = "items";

const filterItems = (filter, items) => {
    return items.filter((i) => {
        if (filter === FilterOptions.All) {
            return true
        } else if (filter === FilterOptions.Active) {
            return !i.complete
        } else if (filter === FilterOptions.Done) {
            return i.complete
        }
    })
};

class App extends Component {

    constructor(props) {
        super(props);

        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            allComplete: false,
            dataSource: ds.cloneWithRows([]),
            filter: FilterOptions.All,
            items: [],
            loading: true,
            value: "",
        };

        this.handleAdd = this.handleAdd.bind(this);
        this.handleClearComplete = this.handleClearComplete.bind(this);
        this.handleRemove = this.handleRemove.bind(this);
        this.handleFilter = this.handleFilter.bind(this);
        this.handleToggleAllComplete = this.handleToggleAllComplete.bind(this);
        this.handleToggleComplete = this.handleToggleComplete.bind(this);
        this.setSource = this.setSource.bind(this);
    }

    componentWillMount() {

        AsyncStorage.getItem(ItemKey)
            .then((json) => {
                    try {
                        const items = JSON.parse(json);
                        this.setSource(items, items);
                    } catch (e) {
                        // Error reporting...
                    }

                    this.setState({loading: false});
                }
            )
    }

    handleAdd() {
        if (!this.state.value) return;

        const newItems = [
            ...this.state.items,
            {
                key: Date.now(),
                text: this.state.value,
                complete: false
            }
        ];
        this.setSource(newItems, filterItems(this.state.filter, newItems), {value: ""});
    }

    handleClearComplete() {
        const newItems = filterItems(FilterOptions.Active, this.state.items);
        this.setSource(newItems, filterItems(this.state.filter, newItems));
    }

    handleFilter(filter) {
        this.setSource(this.state.items, filterItems(filter, this.state.items), {filter});
    }

    handleRemove(key) {
        const newItems = this.state.items.filter((k) => {
            console.log(key);
            console.log(k);
            return k.key !== key;
        });

        this.setSource(newItems, filterItems(this.state.filter, newItems))
    }

    handleToggleAllComplete() {
        const complete = !this.state.allComplete;
        const newItems = this.state.items.map((i) => ({
            ...i,
            complete
        }));
        this.setSource(newItems, filterItems(this.state.filter, newItems), {allComplete: complete});
    }

    handleToggleComplete(key, complete) {
        const newItems = this.state.items.map((i) => {
            console.log(i);
            if (i.key !== key) {
                return i;
            }

            return {
                ...i,
                complete
            };
        });

        this.setSource(newItems, filterItems(this.state.filter, newItems));
    }

    setSource(items, itemDataSource, otherState = {}) {
        this.setState({
            items,
            dataSource: this.state.dataSource.cloneWithRows(itemDataSource),
            ...otherState
        });
        AsyncStorage.setItem(ItemKey, JSON.stringify(items));
    }

    render() {
        return (
            <View style={styles.container}>
                <Header
                    onAddItem={this.handleAdd}
                    onChange={(value) => this.setState({value})}
                    onToggleAllComplete={this.handleToggleAllComplete}
                    value={this.state.value}
                />
                <View style={styles.content}>
                    <ListView
                        enableEmptySections
                        dataSource={this.state.dataSource}
                        onScroll={() => Keyboard.dismiss()}
                        renderRow={({key, ...value}) => {
                            return (
                                <Row key={key}
                                     onComplete={(complete) => this.handleToggleComplete(key, complete)}
                                     onRemove={() => this.handleRemove(key)}
                                     {...value} />
                            )
                        }}
                        renderSeparator={(sectionId, rowId) => {
                            return <View key={rowId} style={styles.separator}/>
                        }}
                        style={styles.list}
                    />
                </View>
                <Footer
                    count={filterItems(FilterOptions.Active, this.state.items).length}
                    onClearComplete={this.handleClearComplete}
                    onFilter={this.handleFilter}
                    filter={this.state.filter}/>
                {this.state.loading &&
                    <View style={styles.loading}>
                        <ActivityIndicator
                            animating
                            size="large"
                        />
                    </View>
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#DDD",
        ... Platform.select({
            ios: {
                paddingTop: 30
            }
        })

    },
    content: {
        flex: 1
    },
    list: {
        backgroundColor: '#FFF'
    },
    loading: {
        position: "absolute",
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0,0,0, .2)"
    },
    separator: {
        borderWidth: 1,
        borderColor: '#F5F5F5'
    }
});

export default App;
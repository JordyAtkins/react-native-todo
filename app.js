import React, {Component} from "react";
import {View, StyleSheet, Platform, ListView, Keyboard} from "react-native";

import Header from './header';
import Footer from './footer';
import Row from './row';

class App extends Component {

    constructor(props) {
        super(props);

        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            value: "",
            items: [],
            allComplete: false,
            dataSource: ds.cloneWithRows([])
        };
        this.setSource = this.setSource.bind(this);
        this.handleRemove = this.handleRemove.bind(this);
        this.handleAdd = this.handleAdd.bind(this);
        this.handleToggleComplete = this.handleToggleComplete.bind(this);
        this.handleToggleAllComplete = this.handleToggleAllComplete.bind(this);
    }

    handleRemove(key) {
        const newItems = this.state.items.filter((k) => {
            console.log(key);
            console.log(k);
            return k.key !== key;
        });

        this.setSource(newItems, newItems)
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
        this.setSource(newItems, newItems, {value: ""});
    }

    setSource(items, itemdDataSource, otherState = {}) {
        this.setState({
            items,
            dataSource: this.state.dataSource.cloneWithRows(itemdDataSource),
            ...otherState
        });
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

        this.setSource(newItems, newItems);
    }

    handleToggleAllComplete() {
        const complete = !this.state.allComplete;
        const newItems = this.state.items.map((i) => ({
            ...i,
            complete
        }));
        this.setSource(newItems, newItems, {allComplete: complete});
    }

    render() {
        return (
            <View style={styles.container}>
                <Header
                    value={this.state.value}
                    onAddItem={this.handleAdd}
                    onChange={(value) => this.setState({value})}
                    onToggleAllComplete={this.handleToggleAllComplete}
                />
                <View style={styles.content}>
                    <ListView
                        style={styles.list}
                        enableEmptySections
                        dataSource={this.state.dataSource}
                        onScroll={() => Keyboard.dismiss()}
                        renderRow={({key, ...value}) => {
                            return (
                                <Row key={key}
                                     onComplete={(complete) => this.handleToggleComplete(key, complete)}
                                     removeItem={() => this.handleRemove(key)}
                                     {...value} />
                            )
                        }}
                        renderSeparator={(sectionId, rowId) => {
                            return <View key={rowId} style={styles.separator}/>
                        }}/>
                </View>
                <Footer/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#888",
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
    separator: {
        borderWidth: 1,
        borderColor: '#F5F5F5'
    }
});

export default App;
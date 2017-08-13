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
        this.handleAdd = this.handleAdd.bind(this);
        this.handleToggleAllComplete = this.handleToggleAllComplete.bind(this);
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
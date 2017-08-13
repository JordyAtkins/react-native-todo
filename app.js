import React, {Component} from "react";
import {View, StyleSheet, Platform} from "react-native";

import Header from './header';
import Footer from './footer';

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            value: "",
            items: [],
            allComplete: false
        };
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
        this.setState({items: newItems, value: ""});
    }

    handleToggleAllComplete() {
        const complete = !this.state.allComplete;
        const newItems = this.state.items.map((i) => ({
            ... i,
            complete
        }));
        console.table(newItems);
        this.setState({items: newItems, allComplete: complete});
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
    }
});

export default App;
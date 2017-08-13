import React, {Component} from "react";
import {View, Text, StyleSheet, TouchableOpacity} from "react-native";

import {FilterOptions} from './filterOptions';

class Footer extends Component {
    render() {
        const {filter} = this.props;
        return (
            <View style={styles.container}>
                <View style={styles.filters}>
                    <TouchableOpacity style={[styles.filter, filter === FilterOptions.All && styles.selected]}
                                      onPress={() => this.props.onFilter(FilterOptions.All)}>
                        <Text>All</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.filter, filter === FilterOptions.Active && styles.selected]}
                                      onPress={() => this.props.onFilter(FilterOptions.Active)}>
                        <Text>Active</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.filter, filter === FilterOptions.Done && styles.selected]}
                                      onPress={() => this.props.onFilter(FilterOptions.Done)}>
                        <Text>Complete</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}
;

const styles = StyleSheet.create({
    container: {
        padding: 16,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    filters: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between"

    },
    filter: {
        padding: 8,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "transparent",
    },
    selected: {
        borderColor: "rgba(175, 47, 47, .2)"
    }
});

export default Footer;
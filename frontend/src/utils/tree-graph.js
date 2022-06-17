import * as d3 from 'd3';

// Copyright 2021 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/tree
export const collapsibleTree = function (
  data,
  {
    // data is either tabular (array of objects) or hierarchy (nested objects)
    path, // as an alternative to id and parentId, returns an array identifier, imputing internal nodes
    id = Array.isArray(data) ? (d) => d.id : null, // if tabular data, given a d in data, returns a unique identifier (string)
    parentId = Array.isArray(data) ? (d) => d.parentId : null, // if tabular data, given a node d, returns its parent’s identifier
    children, // if hierarchical data, given a d in data, returns its children
    tree = d3.tree().nodeSize([10, 192]), // layout algorithm (typically d3.tree or d3.cluster)
    sort, // how to sort nodes prior to layout (e.g., (a, b) => d3.descending(a.height, b.height))
    label, // given a node d, returns the display name
    title, // given a node d, returns its hover text
    link, // given a node d, its link (if any)
    linkTarget = '_blank', // the target attribute for links (if any)
    width = 1500, // outer width, in pixels
    height, // outer height, in pixels
    r = 3, // radius of nodes
    padding = 1, // horizontal padding for first and last column
    fill = '#999', // fill for nodes
    fillOpacity, // fill opacity for nodes
    stroke = '#555', // stroke for links
    strokeWidth = 1.5, // stroke width for links
    strokeOpacity = 0.4, // stroke opacity for links
    strokeLinejoin, // stroke line join for links
    strokeLinecap, // stroke line cap for links
    halo = '#fff', // color of label halo
    haloWidth = 3, // padding around the labels
    dy = 100,
    dx = 5,
    margin = { top: 10, right: 120, bottom: 10, left: 50 },
    diagonal = d3
      .linkHorizontal()
      .x((d) => d.y)
      .y((d) => d.x)
  } = {}
) {
  return new Promise((resolve) => {
    const root = d3.hierarchy(data);

    root.x0 = dy / 2;
    root.y0 = 0;
    root.descendants().forEach((d, i) => {
      d.id = i;
      d._children = d.children;
      if (d.depth && d.data.name.length !== 7) d.children = null;
    });

    const svg = d3
      .create('svg')
      .attr('viewBox', [-margin.left, -margin.top, width, dx])
      .style('font', '10px sans-serif')
      .style('user-select', 'none');

    const gLink = svg
      .append('g')
      .attr('fill', 'none')
      .attr('stroke', '#555')
      .attr('stroke-opacity', 0.4)
      .attr('stroke-width', 1.5);

    const gNode = svg.append('g').attr('cursor', 'pointer').attr('pointer-events', 'all');

    function update(source) {
      const duration = 500;
      const nodes = root.descendants().reverse();
      const links = root.links();

      // Compute the new tree layout.
      tree(root);

      let left = root;
      let right = root;
      root.eachBefore((node) => {
        if (node.x < left.x) left = node;
        if (node.x > right.x) right = node;
      });

      const height = right.x - left.x + margin.top + margin.bottom;

      const transition = svg
        .transition()
        .duration(duration)
        .attr('viewBox', [-margin.left, left.x - margin.top, width, height])
        .tween('resize', window.ResizeObserver ? null : () => () => svg.dispatch('toggle'));

      // Update the nodes…
      const node = gNode.selectAll('g').data(nodes, (d) => d.id);

      // Enter any new nodes at the parent's previous position.
      const nodeEnter = node
        .enter()
        .append('g')
        .attr('transform', (d) => `translate(${source.y0},${source.x0})`)
        .attr('fill-opacity', 0)
        .attr('stroke-opacity', 0)
        .on('click', (event, d) => {
          d.children = d.children ? null : d._children;
          update(d);
        });

      nodeEnter
        .append('circle')
        .attr('r', 2.5)
        .attr('fill', (d) => (d._children ? '#555' : '#999'))
        .attr('stroke-width', 10);

      nodeEnter
        .append('text')
        .attr('dy', '0.31em')
        .attr('x', (d) => (d._children ? -6 : 6))
        .attr('text-anchor', (d) => (d._children ? 'end' : 'start'))
        .text((d) => d.data.name)
        .clone(true)
        .lower()
        .attr('stroke-linejoin', 'round')
        .attr('stroke-width', 3)
        .attr('stroke', 'white');

      // Transition nodes to their new position.
      const nodeUpdate = node
        .merge(nodeEnter)
        .transition(transition)
        .attr('transform', (d) => `translate(${d.y},${d.x})`)
        .attr('fill-opacity', 1)
        .attr('stroke-opacity', 1);

      // Transition exiting nodes to the parent's new position.
      const nodeExit = node
        .exit()
        .transition(transition)
        .remove()
        .attr('transform', (d) => `translate(${source.y},${source.x})`)
        .attr('fill-opacity', 0)
        .attr('stroke-opacity', 0);

      // Update the links…
      const link = gLink.selectAll('path').data(links, (d) => d.target.id);

      // Enter any new links at the parent's previous position.
      const linkEnter = link
        .enter()
        .append('path')
        .attr('d', (d) => {
          const o = { x: source.x0, y: source.y0 };
          return diagonal({ source: o, target: o });
        });

      // Transition links to their new position.
      link.merge(linkEnter).transition(transition).attr('d', diagonal);

      // Transition exiting nodes to the parent's new position.
      link
        .exit()
        .transition(transition)
        .remove()
        .attr('d', (d) => {
          const o = { x: source.x, y: source.y };
          return diagonal({ source: o, target: o });
        });

      // Stash the old positions for transition.
      root.eachBefore((d) => {
        d.x0 = d.x;
        d.y0 = d.y;
      });
    }

    update(root);

    resolve(svg.node());
  });
};

package com.atomist.tree.content.text

import com.atomist.tree.{ContainerTreeNode, MutableTreeNode, TreeNode}
import com.typesafe.scalalogging.LazyLogging

/**
  * ContainerTreeNode that allows updates.
  */
trait MutableContainerTreeNode
  extends ContainerTreeNode
    with MutableTreeNode
    with LazyLogging {

  def fieldValues: Seq[TreeNode]

  def appendField(newField: TreeNode): Unit

  def appendFields(newFields: Seq[TreeNode]): Unit = {
    newFields.foreach(appendField)
  }

  override def dirty: Boolean =
    (childNodes collect {
      case u: MutableTreeNode if u.dirty => u
    }).nonEmpty

  /**
    * Return formatInfo for the child node. We can obtain
    * line and column and formatting information.
    *
    * @param child child of this node
    * @return Some if the child is found
    */
  def formatInfo(child: TreeNode): Option[FormatInfo] = {
    def descs(f: MutableContainerTreeNode): Seq[TreeNode] = {
      f +: f.fieldValues.flatMap {
        case d: MutableContainerTreeNode => descs(d)
        case n => Seq(n)
      }
    }

    val descendants = descs(this)

    if (!descendants.contains(child))
      None
    else {
      // Build string to the left
      val leftFields = descendants.takeWhile(f => f != child)
      val stringToLeft = leftFields
        .filter(_.childNodes.isEmpty)
        .map(_.value).mkString("")
      val leftPoint = FormatInfo.contextInfo(stringToLeft)
      val rightPoint = FormatInfo.contextInfo(stringToLeft + child.value)
      //println(s"Found $fi from left string [$stringToLeft] with start=$start")
      Some(FormatInfo(leftPoint, rightPoint))
    }
  }

}